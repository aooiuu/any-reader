import { merge } from 'lodash-es';

// @ts-expect-error
import { ensureFileSync, readJSONSync, writeJSONSync } from 'fs-extra/esm';
import { AnalyzerException, AnalyzerManager, FetchException, JsVmException, createAnalyzerManager } from '@any-reader/core';
import { LogLevel } from '@any-reader/core';
import { LOCAL_BOOK_DIR } from './constants';
import type { DB } from './data-source';
import { createDB } from './data-source';
import { ChapterHistory } from './controller/ChapterHistory';
import { ResourceHistory } from './controller/ResourceHistory';
import { ResourceFavorites } from './controller/ResourceFavorites';
import { ResourceRule } from './controller/ResourceRule';
import { RuleManager } from './controller/RuleManager';
import { Bookshelf } from './controller/Bookshelf';
import { Config } from './controller/Config';
import { TTS } from './controller/TTS';
import { Cache } from './controller/Cache';
import { mapRoute } from './decorators';

export interface App {
  db: DB;
  config: any;
  configPath: any;
  controllers: any[];
  updateConfig: (data: any) => void;
  readConfig: () => void;
  useApi: (register: any) => void;
  analyzerManager: AnalyzerManager;
}

export function createApp(params: { configPath: string; defaultConfig?: any; dataSourceOptions?: any; analyzerManager?: AnalyzerManager }): App {
  const { dataSourceOptions } = params;
  const defConfig = params.defaultConfig ?? {};

  const app: App = {
    db: createDB({
      dataSourceOptions
    }),
    config: {},
    configPath: params.configPath,
    analyzerManager: params.analyzerManager || createAnalyzerManager(),

    controllers: [ChapterHistory, ResourceHistory, ResourceFavorites, ResourceRule, RuleManager, Bookshelf, Config, TTS, Cache],

    updateConfig(data: any) {
      ensureFileSync(app.configPath);
      app.config = merge(app.config, data || {});
      writeJSONSync(app.configPath, app.config, { spaces: 2 });
    },

    readConfig() {
      ensureFileSync(app.configPath);
      let config = {};
      try {
        config = readJSONSync(app.configPath);
      } catch (error) {
        console.warn(error);
      }
      app.config = merge(defConfig, config);
      if (!app.config.bookDir) app.config.bookDir = LOCAL_BOOK_DIR;
    },

    useApi(register: any) {
      runApp(app, register);
    }
  };

  app.readConfig();
  return app;
}

async function runApp(app: App, register: any) {
  await app.db.initialize();

  for (const Controller of app.controllers) {
    const routes = mapRoute(Controller);
    for (const route of routes) {
      const callName = [route.method.toLowerCase(), route.route].join('@');
      register(callName, async (...arg: any) => {
        const instance: any = new Controller(app);
        app.analyzerManager.logLevel >= LogLevel.Debug && app.analyzerManager.logger.debug(`[call] ${callName} ${JSON.stringify(arg)}`);

        return await instance[route.methodName](...arg)
          .then((res: any) => result(res))
          .catch((err: Error) => {
            app.analyzerManager.logLevel >= LogLevel.Error && err.message && app.analyzerManager.logger.error(`[错误] ${err.message}`);
            let message = err?.message || 'error';
            if (err instanceof FetchException) message = '网络请求异常';
            else if (err instanceof JsVmException) message = '执行脚本异常';
            else if (err instanceof AnalyzerException) message = '规则解析异常';
            return result([], message, -1);
          });
      });
    }
  }
}

function result(data: any, msg = '', code = 0) {
  return {
    code,
    data,
    msg
  };
}

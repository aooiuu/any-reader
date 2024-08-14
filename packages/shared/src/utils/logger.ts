import fs from 'node:fs';
import path from 'node:path';
import log4js from 'log4js';
import { LOG_DIR } from '../constants';

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

log4js.addLayout('json', (config) => {
  return function (logEvent) {
    let data = logEvent.data;
    if (Array.isArray(data) && data.length === 1) data = data[0];
    if (typeof data === 'string' && /^\{.*?\}$/.test(data)) {
      try {
        data = JSON.parse(data);
      } catch (error) {
        console.warn(error);
      }
    }

    return (
      JSON.stringify({
        startTime: logEvent.startTime,
        pid: logEvent.pid,
        data
      }) + config.separator
    );
  };
});

log4js.configure({
  appenders: {
    app: {
      type: 'dateFile',
      filename: path.resolve(LOG_DIR, 'application.log'),
      encoding: 'utf-8',
      pattern: 'yyyy-MM-dd',
      keepFileExt: true,
      alwaysIncludePattern: true,
      layout: {
        type: 'json',
        separator: ','
      }
    }
  },
  categories: {
    default: { appenders: ['app'], level: 'all' }
  }
});

export const logger = log4js.getLogger();

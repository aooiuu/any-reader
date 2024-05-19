import EasyPostMessage from 'easy-post-message';
import Adapter from 'easy-post-message/electron-adapter';
import { readConfig, updateConfig } from './config';

function success(data: any, msg = '') {
  return {
    code: 0,
    data,
    msg
  };
}

export function createAPI() {
  const pm = new EasyPostMessage(Adapter);
  const { api } = require('@any-reader/shared');

  pm.answer('get@discoverMap', async ({ ruleId = '' } = {}) => success(await api.discoverMap(ruleId)));
  pm.answer('get@getFavorites', async () => success(await api.getFavorites()));
  pm.answer('get@getHistory', async () => success(await api.getHistory()));
  pm.answer('get@getLocalBooks', async () => success(await api.getLocalBooks()));
  pm.answer('post@discover', async (data: any) => success(await api.discover(data)));
  pm.answer('post@star', async (data: any) => success(await api.star(data)));
  pm.answer('post@unstar', async (data: any) => success(await api.unstar(data)));
  pm.answer('get@rules', () => success(api.rules()));
  pm.answer('get@getRuleById', ({ id = '' } = {}) => success(api.getRuleById(id)));
  pm.answer('post@createRule', async (data: any) => success(await api.createRule(data)));
  pm.answer('post@updateRule', async (data: any) => success(await api.updateRule(data)));
  pm.answer('post@searchByRuleId', async (data: any) => success(await api.searchByRuleId(data).catch(() => [])));
  pm.answer('post@content', async (data: any) => success(await api.content(data)));
  pm.answer('post@getChapter', async (data: any) => success(await api.getChapter(data)));

  pm.answer('get@readConfig', async () => success(await readConfig()));
  pm.answer('post@updateConfig', async (data: any) => success(updateConfig(data)));
}

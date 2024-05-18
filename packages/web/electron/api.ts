import { api } from '@any-reader/shared';
import EasyPostMessage from 'easy-post-message';
import Adapter from 'easy-post-message/electron-adapter';

function success(data: any, msg = '') {
  return {
    code: 0,
    data,
    msg
  };
}

export function createAPI() {
  const pm = new EasyPostMessage(Adapter);

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
  pm.answer('post@searchByRuleId', async (data: any) => success(await api.searchByRuleId(data)));
  pm.answer('post@content', async (data: any) => success(await api.content(data)));
  pm.answer('post@getChapter', async (data: any) => success(await api.getChapter(data)));
}

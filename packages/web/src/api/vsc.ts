import { request } from '@/utils/request';

export function getChapter(ruleId: string, data: any) {
  return request({
    method: 'post',
    url: 'vscode/getChapter',
    data: {
      ruleId,
      data
    }
  });
}

export function openLocalBookDir() {
  return request({
    method: 'get',
    url: 'vscode/openLocalBookDir'
  });
}

export function executeCommand(data: any) {
  return request({
    method: 'post',
    url: 'vscode/executeCommand',
    data
  });
}

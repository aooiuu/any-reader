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

export function editBookSource() {
  return request({
    method: 'get',
    url: 'vscode/editBookSource'
  });
}

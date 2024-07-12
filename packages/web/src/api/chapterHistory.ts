import { request } from '@/utils/request';

export function saveChapterHistory(data: any) {
  return request({
    method: 'post',
    url: 'chapterHistory/save',
    data
  });
}

export function getChapterHistorys(data: any) {
  return request({
    method: 'post',
    url: 'chapterHistory/list',
    data
  });
}

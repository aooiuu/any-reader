/**
 * vscode
 */

import { request } from '@/utils/request';

export function base64(data: any) {
  return request({
    method: 'post',
    url: 'tts/base64',
    data
  });
}

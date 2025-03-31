/**
 * vscode
 */

import { request } from '@/utils/request';

export function executeCommand(data: any) {
  return request({
    method: 'post',
    url: 'vscode/executeCommand',
    data
  });
}

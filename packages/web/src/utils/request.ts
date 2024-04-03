import { PLATFORM } from '@/constants';
import axios from './axios';
import { pm } from './postMessage';

export async function request(config: any) {
  if (PLATFORM === 'browser') {
    return await axios(config);
  } else {
    const method = config.method ?? 'get';
    return await pm.send(`${method}@${config.url}`, config.params || config.data, window.acquireVsCodeApi());
  }
}

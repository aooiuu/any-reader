import NProgress from 'nprogress';
import { PLATFORM } from '@/constants';
import axios from './axios';
import { pm } from './postMessage';

NProgress.configure({ showSpinner: false });

export async function request(config: any) {
  if (PLATFORM === 'browser') {
    return await axios(config);
  } else {
    const method = config.method ?? 'get';
    !NProgress.isStarted() && NProgress.start();
    const res = await pm.send(`${method}@${config.url}`, config.params || config.data, window.acquireVsCodeApi());
    NProgress.done();
    return res;
  }
}

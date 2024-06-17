import NProgress from 'nprogress';
import { PLATFORM } from '@/constants';
import axios from './axios';

NProgress.configure({ showSpinner: false });

export async function request(config: any) {
  console.log('[request]', config);
  const method = config.method ?? 'get';
  if (PLATFORM === 'browser') {
    // web
    return await axios(config);
  } else if (PLATFORM === 'electron') {
    // electron
    const { pm } = await import(`./postMessage.electron`);
    return pm.send(`${method}@${config.url}`, getPatams(config));
  } else if (PLATFORM === 'utools') {
    // utools
    return await window.$AnyReader.request({
      url: `${method}@${config.url}`,
      data: getPatams(config)
    });
  } else {
    // vscode
    const { pm } = await import(`./postMessage`);
    !NProgress.isStarted() && NProgress.start();
    const res = await pm.send(`${method}@${config.url}`, getPatams(config), window.acquireVsCodeApi());
    NProgress.done();
    return res;
  }
}

function getPatams(config: any) {
  let data = config.params || config.data;
  data = typeof data === 'object' ? JSON.parse(JSON.stringify(data)) : data;
  return data;
}

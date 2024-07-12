import { PLATFORM } from '@/constants';
import axios from './axios';

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
    return await pm.send(`${method}@${config.url}`, getPatams(config), window.acquireVsCodeApi());
  }
}

function getPatams(config: any) {
  let data = config.params || config.data;
  data = typeof data === 'object' ? JSON.parse(JSON.stringify(data)) : data;
  return data;
}

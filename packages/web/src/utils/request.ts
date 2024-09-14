import { message } from 'ant-design-vue';
import { PLATFORM } from '@/constants';
import axios from './axios';

export async function request(config: any): Promise<{
  code: number;
  data: any;
  msg?: string;
}> {
  const method = config.method?.toLowerCase() ?? 'get';
  if (PLATFORM === 'browser') {
    // web
    return await axios(config);
  } else if (PLATFORM === 'electron') {
    // electron
    const { pm } = await import(`./postMessage.electron`);
    return wrapSend(pm.send(`${method}@${config.url}`, getPatams(config)), config);
  } else if (PLATFORM === 'utools') {
    // utools
    return wrapSend(
      window.$AnyReader.request({
        url: `${method}@${config.url}`,
        data: getPatams(config)
      }),
      config
    );
  } else {
    // vscode
    const { pm } = await import(`./postMessage`);
    return wrapSend(pm.send(`${method}@${config.url}`, getPatams(config), window.acquireVsCodeApi()), config);
  }
}

async function wrapSend(fn: Promise<any>, config: any) {
  const data = await fn;
  const { code, msg } = data;
  const { showMsg = true } = config as any;

  if (code === -1) {
    msg && showMsg && message.warning(msg);
    return Promise.reject(data);
  }

  return data;
}

function getPatams(config: any) {
  let data = config.params || config.data;
  data = typeof data === 'object' ? JSON.parse(JSON.stringify(data)) : data;
  return data;
}

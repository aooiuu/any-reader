import http from 'node:http';
import https from 'node:https';

/**
 * ping
 * @param {string} url 地址
 * @param {number} port 端口
 * @returns {Promise<number>} -1=失败
 */
export default function ping(url: string, port?: number, timeout?: number): Promise<number> {
  return new Promise<number>((resolve) => {
    if (!url || !url.startsWith('http')) return -1;
    const isHttps = url.startsWith('https');
    const send = isHttps ? https.request : http.request;
    const outPort = port || (isHttps ? 443 : 80);
    const baseUrl = url.replace('http://', '').replace('https://', '');

    const options = { host: baseUrl, port: outPort, path: '/' };
    const start = Date.now();

    const req = send(options, () => {
      resolve(Date.now() - start);
      req.destroy();
    });

    req.on('error', () => {
      resolve(-1);
    });

    timeout &&
      req.setTimeout(timeout, function () {
        resolve(-1);
        req.destroy();
      });

    req.write('');
    req.end();
  });
}

import * as fs from 'node:fs';
import * as path from 'node:path';
import { CACHE_DIR } from '../constants';
import { createCacheDecorator } from './create-cache-decorator';

export function getCachePath(key: string) {
  if (!key) throw new Error('key is required');
  const keys = key.split('@');
  const fileName = keys.pop() as string;
  const dir = path.join(CACHE_DIR, ...keys);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  return path.join(dir, `${fileName}.json`);
}

export const Cacheable = createCacheDecorator<any>({
  getItem: async (key: string) => {
    const cachePath = getCachePath(key);
    if (!fs.existsSync(cachePath)) return;
    let jsonData;
    try {
      jsonData = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
    } catch (error) {
      fs.unlinkSync(cachePath);
      return;
    }
    if (!jsonData || !jsonData.val || (jsonData.exp !== 0 && jsonData.exp < Date.now())) {
      fs.unlinkSync(cachePath);
      return;
    }

    return jsonData.val;
  },
  setItem: async (key: string, val: any, options: { ttl: number }) => {
    const data = JSON.stringify({
      val,
      exp: options.ttl ? Date.now() + options.ttl : 0
    });
    fs.writeFile(getCachePath(key), data, 'utf-8', () => {});
  }
});

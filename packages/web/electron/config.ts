import * as os from 'node:os';
import * as path from 'node:path';
import { ensureFile, readJson, writeJson } from 'fs-extra';

export const ROOT_PATH = path.join(os.homedir(), '.any-reader');

export const CONFIG_PATH = path.join(ROOT_PATH, 'config.desktop.json');

console.log({ CONFIG_PATH });

export async function readConfig() {
  await ensureFile(CONFIG_PATH);
  return await readJson(CONFIG_PATH).catch(() => ({}));
}

export async function updateConfig(data: any) {
  await ensureFile(CONFIG_PATH);
  writeJson(CONFIG_PATH, data, { spaces: 2 });
}

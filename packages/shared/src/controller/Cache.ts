import { promises as fs } from 'fs';
import path from 'path';
import { Controller, Post } from '../decorators';
import { BaseController } from './BaseController';
import { CACHE_DIR } from '../constants';

@Controller('/cache')
export class Cache extends BaseController {
  @Post('clear')
  async clear() {
    const dirs = (await fs.readdir(CACHE_DIR))
      .map((file) => path.resolve(CACHE_DIR, file))
      .filter(async (dir) => {
        const stat = await fs.stat(dir);
        return stat?.isDirectory();
      });
    for (const dir of dirs) {
      await fs
        .rmdir(dir, {
          recursive: true
        })
        .catch((err) => {
          console.warn(err);
        });
    }
  }
}

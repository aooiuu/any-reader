import fs from 'fs';
import path from 'path';
import { Controller, Post } from '../decorators';
import { BaseController } from './BaseController';
import { CACHE_DIR } from '../constants';

@Controller('/cache')
export class Cache extends BaseController {
  @Post('clear')
  async clear() {
    const dirs = fs
      .readdirSync(CACHE_DIR)
      .map((file) => path.resolve(CACHE_DIR, file))
      .filter((dir) => {
        const stat = fs.statSync(dir);
        return stat?.isDirectory();
      });

    dirs.forEach((dir) => {
      try {
        fs.rmdirSync(dir, {
          recursive: true
        });
      } catch (error) {
        console.warn(error);
      }
    });
  }
}

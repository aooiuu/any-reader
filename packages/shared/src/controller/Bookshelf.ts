import { openExplorer } from 'explorer-opener';
import { Controller, Post } from '../decorators';
import { getBookList } from '../utils/book-manager';
import { BaseController } from './BaseController';

const isElectron = typeof process !== 'undefined' && process.versions && process.versions.electron;

@Controller('/bookshelf')
export class Bookshelf extends BaseController {
  @Post('list')
  async read() {
    return (await getBookList(this.app.config.bookDir)).map((e) => {
      return {
        name: e.name,
        path: e.path
      };
    });
  }

  // vscode, desktop
  @Post('open-dir')
  async openDir() {
    if (isElectron) {
      await openExplorer(this.app.config.bookDir);
    }
  }
}

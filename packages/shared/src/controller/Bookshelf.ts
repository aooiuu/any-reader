import { Controller, Post } from '../decorators';
import { getBookList } from '../utils/book-manager';
import { BaseController } from './BaseController';

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
}

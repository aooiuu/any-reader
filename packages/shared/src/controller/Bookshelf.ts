import { Controller, Post } from '../decorators'
import bookManager from '../utils/book-manager'
import { BaseController } from './BaseController'

@Controller('/bookshelf')
export class Bookshelf extends BaseController {
  @Post('list')
  read() {
    return bookManager.getBookList(this.app.config.bookDir)
  }
}

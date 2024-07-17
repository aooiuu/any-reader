import { Controller, Post } from '../decorators'
import localBookManager from '../utils/localBookManager'
import { BaseController } from './BaseController'

@Controller('/bookshelf')
export class Bookshelf extends BaseController {
  @Post('list')
  read() {
    return localBookManager.getBookList(this.app.config.bookDir)
  }
}

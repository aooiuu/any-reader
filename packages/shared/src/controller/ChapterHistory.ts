import { Controller, Post } from '../decorators';
import { BaseController } from './BaseController';

@Controller('/chapter-history')
export class ChapterHistory extends BaseController {
  @Post('save')
  save(data: any) {
    return this.db.getChapterHistory().save(data);
  }

  @Post('list')
  list(data: any) {
    return this.db.getChapterHistory().list(data);
  }
}

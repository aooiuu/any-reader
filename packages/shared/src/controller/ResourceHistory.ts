import { Controller, Post } from '../decorators';
import { BaseController } from './BaseController';

@Controller('/resource-history')
export class ResourceHistory extends BaseController {
  // 获取列表
  @Post('list')
  list() {
    return this.db.getResourceHistory().list();
  }

  // 删除一个记录
  @Post('remove')
  remove(data: any) {
    return this.db.getResourceHistory().remove(data);
  }

  @Post('del')
  del(data: any) {
    return this.db.getResourceHistory().remove(data);
  }

  // 添加一个记录
  @Post('add')
  async create(data: any) {
    return await this.db.getResourceHistory().create(data);
  }
}

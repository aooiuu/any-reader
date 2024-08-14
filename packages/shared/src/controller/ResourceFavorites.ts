import { Controller, Post } from '../decorators';
import { BaseController } from './BaseController';

@Controller('/resource-favorites')
export class ResourceFavorites extends BaseController {
  // 获取列表
  @Post('list')
  list() {
    return this.db.getResourceFavorites().list();
  }

  // 删除
  @Post('unstar')
  unstar(data: any) {
    return this.db.getResourceFavorites().remove(data);
  }

  // 添加
  @Post('star')
  star(data: any) {
    return this.db.getResourceFavorites().create(data);
  }
}

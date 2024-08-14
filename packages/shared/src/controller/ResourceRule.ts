import { Controller, Post } from '../decorators';
import { BaseController } from './BaseController';

@Controller('/resource-rule')
export class ResourceRule extends BaseController {
  // 列表
  @Post('list')
  list() {
    return this.db.getResourceRule().list();
  }

  @Post('find-by-id')
  findById(arg: any) {
    return this.db.getResourceRule().findById(arg.id);
  }

  // 添加
  @Post('create')
  create(arg: any) {
    return this.db.getResourceRule().save(arg);
  }

  // 编辑
  @Post('save')
  save(arg: any) {
    return this.db.getResourceRule().save(arg);
  }

  // 删除
  @Post('remove-by-id')
  removeById(arg: any) {
    return this.db.getResourceRule().removeById(arg.id);
  }

  @Post('import-cms')
  importCMS(arg: any) {
    return this.db.getResourceRule().importCMS(arg);
  }

  @Post('import')
  import(arg: any) {
    return this.db.getResourceRule().importRules(arg.url);
  }

  @Post('batch-update')
  batchUpdateRules({ ids, rule }: { ids: number[]; rule: any }) {
    return this.db.getResourceRule().repository.update(ids, {
      ...rule
    });
  }

  @Post('ping')
  async ping(arg: any) {
    return await this.db.getResourceRule().ping(arg);
  }
}

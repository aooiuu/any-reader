import type { Repository } from 'typeorm';
import type { ResourceHistory } from '../entity/ResourceHistory';

export class ResourceHistoryService {
  repository: Repository<ResourceHistory>;

  constructor(repository: Repository<ResourceHistory>) {
    this.repository = repository;
  }

  async list() {
    return this.repository.find({
      order: {
        updateTime: 'DESC'
      },
      take: 100
    });
  }

  // 删除一个记录
  async remove(data: any) {
    const { ruleId, url } = data;
    return await this.repository.delete({
      ruleId,
      url
    });
  }

  // 添加一个记录
  async create(data: any) {
    data.url = data.url || data.filePath;
    await this.remove(data);
    const now = Date.now();
    const entity = this.repository.create({
      ...data,
      id: undefined,
      createTime: now,
      updateTime: now
    });
    return await this.repository.save(entity);
  }
}

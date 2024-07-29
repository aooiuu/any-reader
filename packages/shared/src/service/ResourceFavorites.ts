import type { Repository } from 'typeorm'
import type { ResourceFavorites } from '../entity/ResourceFavorites'

export class ResourceFavoritesService {
  repository: Repository<ResourceFavorites>

  constructor(repository: Repository<ResourceFavorites>) {
    this.repository = repository
  }

  async list() {
    return this.repository.find({
      order: {
        updateTime: 'DESC',
      },
      take: 100,
    })
  }

  // 删除一个记录
  async remove(data: ResourceRow) {
    const { ruleId, url } = data
    return await this.repository.delete({
      ruleId,
      url,
    })
  }

  // 添加一个记录
  async create(data: ResourceRow) {
    await this.remove(data)
    const now = Date.now()
    const entity = this.repository.create({
      ...data,
      id: undefined,
      createTime: now,
      updateTime: now,
    })
    return await this.repository.save(entity)
  }
}

interface ResourceRow {
  ruleId: string
  url: string
}

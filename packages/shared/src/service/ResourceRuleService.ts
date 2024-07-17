import type { Repository } from 'typeorm'
import axios from 'axios'
import type { Rule } from '@any-reader/rule-utils'
import { cmsJsonToRule, cmsXmlToRule, decodeRule, isEsoStr, isRule } from '@any-reader/rule-utils'
import type { ResourceRule } from '../entity/ResourceRule'
import type { RuleExtra } from '../entity/RuleExtra'
import ping from '../utils/ping'

// function getCols<T extends object>(repository: Repository<T>): (keyof T)[] {
//   return (repository.metadata.columns.map(col => col.propertyName) as (keyof T)[])
// }

export class ResourceRuleService {
  repository: Repository<ResourceRule>
  ruleExtraRepository: Repository<RuleExtra>

  constructor(repository: Repository<ResourceRule>, ruleExtraRepository: Repository<RuleExtra>) {
    this.repository = repository
    this.ruleExtraRepository = ruleExtraRepository
  }

  list() {
    return this.repository.find({
      order: {
        modifiedTime: 'DESC',
      },
      relations: {
        extra: true,
      },
      select: {
        id: true,
        name: true,
        host: true,
        enableSearch: true,
        enableDiscover: true,
        author: true,
        contentType: true,
        extra: {
          ping: true,
        },
      },
      // take: 100,
    })
  }

  findById(id: string): Promise<Rule | null> {
    return this.repository.findOneBy({
      id,
    }) as Promise<Rule | null>
  }

  // 删除一个记录
  removeById(id: string) {
    return this.repository.delete({
      id,
    })
  }

  // 保存
  async save(data: any) {
    const entity = data.id && await this.repository.findOneBy({ id: data.id })
    if (entity) {
      Object.assign(entity, data, {
        modifiedTime: Date.now(),
      })
      return await this.repository.save(entity)
    }
    else {
      const now = Date.now()
      const entity = this.repository.create({
        ...data,
        createTime: now,
        modifiedTime: now,
      })
      return await this.repository.save(entity)
    }
  }

  async importCMS(params: ImportCMSParams) {
    let rule = {} as Rule
    if (params.type === 'maccms.json')
      rule = await cmsJsonToRule(params.api)
    else if (params.type === 'maccms.xml')
      rule = await cmsXmlToRule(params.api)
    else
      throw new Error('未知的规则类型')

    Object.assign(rule, { name: params.name })
    return await this.save(rule)
  }

  async importRules(url: string) {
    if (typeof url !== 'string')
      return
    // 单个压缩规则
    if (isEsoStr(url)) {
      await this.save(decodeRule(url.trim())).catch(() => {})
      return 1
    }
    // 网络地址
    if (/^https?:\/\/.{3,}/.test(url)) {
      const res = await axios.create().get(url).catch((e) => {
        console.warn(e)
      })
      if (!res || Array.isArray(res?.data))
        return

      for (const rule of res.data) {
        if (isRule(rule))
          await this.save(rule).catch(() => {})
      }
      return res.data.length
    }
    // json 字符串
    let json
    try {
      json = JSON.parse(url)
    }
    catch (error) {
      console.warn('导入格式不支持')
    }
    if (typeof json !== 'object')
      return 0
    const jsons = Array.isArray(json) ? json : [json]
    for (let json of jsons) {
      if (typeof json === 'string' && isEsoStr(json)) {
        try {
          json = decodeRule(json)
        }
        catch (error) {
          console.warn(error)
          continue
        }
      }
      if (isRule(json))
        await this.save(json).catch(() => {})
    }
    return jsons.length
  }

  // 测速
  async ping({ id = '', host = '' } = {}) {
    const n = await ping(host)
    let entity = await this.ruleExtraRepository.findOneBy({ ruleId: id })
    if (!entity)
      entity = this.ruleExtraRepository.create({ ruleId: id, createTime: Date.now() })
    entity.ping = n
    entity.updateTime = Date.now()
    await this.ruleExtraRepository.save(entity)
    return entity
  }
}

interface ImportCMSParams {
  type: string
  name: string
  api: string
}

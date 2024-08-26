import type { Repository } from 'typeorm';
import type { Rule } from '@any-reader/rule-utils';
import { cmsJsonToRule, cmsXmlToRule, text2rules } from '@any-reader/rule-utils';
import type { ResourceRule } from '../entity/ResourceRule';
import type { RuleExtra } from '../entity/RuleExtra';
import ping from '../utils/ping';

// function getCols<T extends object>(repository: Repository<T>): (keyof T)[] {
//   return (repository.metadata.columns.map(col => col.propertyName) as (keyof T)[])
// }

export class ResourceRuleService {
  repository: Repository<ResourceRule>;
  ruleExtraRepository: Repository<RuleExtra>;

  constructor(repository: Repository<ResourceRule>, ruleExtraRepository: Repository<RuleExtra>) {
    this.repository = repository;
    this.ruleExtraRepository = ruleExtraRepository;
  }

  list() {
    return this.repository.find({
      order: {
        modifiedTime: 'DESC'
      },
      relations: {
        extra: true
      }
      // select: {
      //   id: true,
      //   name: true,
      //   host: true,
      //   enableSearch: true,
      //   enableDiscover: true,
      //   author: true,
      //   contentType: true,
      //   extra: {
      //     ping: true,
      //   },
      // },
      // take: 100,
    });
  }

  findById(id: string): Promise<Rule | null> {
    return this.repository.findOneBy({
      id
    }) as Promise<Rule | null>;
  }

  // 删除一个记录
  removeById(id: string | string[]) {
    return this.repository
      .createQueryBuilder()
      .delete()
      .where('id IN (:...ids)', { ids: Array.isArray(id) ? id : [id] })
      .execute();
  }

  // 保存
  async save(data: any) {
    const entity = data.id && (await this.repository.findOneBy({ id: data.id }));
    if (entity) {
      Object.assign(entity, data, {
        modifiedTime: Date.now()
      });
      return await this.repository.save(entity);
    } else {
      const now = Date.now();
      const entity = this.repository.create({
        ...data,
        createTime: now,
        modifiedTime: now
      });
      return await this.repository.save(entity);
    }
  }

  async importCMS(params: ImportCMSParams) {
    let rule = {} as Rule;
    if (params.type === 'maccms.json') rule = await cmsJsonToRule(params.api);
    else if (params.type === 'maccms.xml') rule = await cmsXmlToRule(params.api);
    else throw new Error('未知的规则类型');

    Object.assign(rule, { name: params.name });
    return await this.save(rule);
  }

  async importRules(text: string) {
    const rules = await text2rules(text);
    let count = 0;
    for (const rule of rules) {
      await this.save(rule)
        .then(() => {
          count++;
        })
        .catch(() => {});
    }
    return count;
  }

  // 测速
  async ping({ id = '', host = '' } = {}) {
    const n = await ping(host);
    let entity = await this.ruleExtraRepository.findOneBy({ ruleId: id });
    if (!entity) entity = this.ruleExtraRepository.create({ ruleId: id, createTime: Date.now() });
    entity.ping = n;
    entity.updateTime = Date.now();
    await this.ruleExtraRepository.save(entity);
    return entity;
  }
}

interface ImportCMSParams {
  type: string;
  name: string;
  api: string;
}

import md5 from 'blueimp-md5';
import type { Rule } from '@any-reader/rule-utils';
import { ContentType } from '@any-reader/rule-utils';
import { analyzerUrl } from '../utils/rule-parse';
import { Cacheable, Controller, Post } from '../decorators';
import { cacheUtils } from '../decorators/cache';
import { createBookParser } from '../utils/book-manager';
import { BaseController } from './BaseController';

@Controller('/rule-manager')
export class RuleManager extends BaseController {
  @Post('discover-map')
  @Cacheable({
    ttl: 1000 * 60 * 60,
    cacheKey({ args }) {
      const { ruleId = '' } = args[0];
      return `discoverMap@${ruleId}`;
    }
  })
  async discoverMap({ ruleId }: { ruleId: string }) {
    const rule = await this.getRule(ruleId);
    return await this.discoverMapByRule({ rule });
  }

  @Post('discover')
  @Cacheable({
    ttl: 1000 * 60 * 60,
    cacheKey({ args }) {
      const { ruleId = '', data } = args[0];
      return `discover@${ruleId}@${md5(data.value)}`;
    }
  })
  async discover({ ruleId, data }: { ruleId: string; data: any }) {
    const rule = await this.getRule(ruleId);
    return await this.discoverByRule({ rule, data });
  }

  @Post('search-by-rule-id')
  // @Cacheable({
  //   ttl: 1000 * 60 * 5,
  //   cacheKey({ args }) {
  //     const { ruleId = '', keyword = '' } = args[0]
  //     return `searchByRuleId@${ruleId || '__local__'}@v2_${md5(keyword)}`
  //   },
  // })
  async searchByRuleId({ ruleId, keyword }: { ruleId: string; keyword: string }) {
    const rule = await this.getRule(ruleId);
    return await this.searchByRule({ rule, keyword });
  }

  @Post('chapter')
  @Cacheable({
    ttl: 1000 * 60 * 60,
    cacheKey({ args }) {
      const { ruleId = '', filePath = '' } = args[0];
      return `chapter@${ruleId || '__local__'}@v2_${md5(filePath)}`;
    }
  })
  async getChapter({ ruleId, filePath }: { ruleId?: string; filePath: string }) {
    if (ruleId) {
      const rule = await this.getRule(ruleId);
      return await this.chapterByRule({ rule, filePath });
    }
    // 本地
    return await createBookParser(filePath).getChapter();
  }

  @Post('content')
  async content({ filePath, chapterPath, ruleId, noCache }: { ruleId: string; filePath: string; chapterPath: string; noCache: boolean }) {
    const cacheKey = `content@${ruleId || '__local__'}@${md5(filePath)}@v3_${md5(chapterPath)}`;
    const result: {
      contentType?: number;
      content: string[] | string;
    } = {
      content: []
    };
    if (noCache) {
      // 移除缓存
      cacheUtils.removeItem(cacheKey);
    } else {
      const res = await cacheUtils.getItem(cacheKey);
      if (res) return res;
    }

    if (ruleId) {
      // 在线
      const rule = await this.getRule(ruleId);
      const { contentType, content } = await this.contentByRule({ rule, chapterPath });
      result.content = content;
      result.contentType = contentType;
    } else {
      // 本地
      const content = await createBookParser(filePath).getContent(chapterPath);
      result.content = content;
    }
    if (!result.content.length) throw new Error('获取内容失败');

    cacheUtils.setItem(cacheKey, result, { ttl: 0 });
    return result;
  }

  @Post('search-by-rule')
  async searchByRule({ rule, keyword }: { rule: Rule; keyword: string }) {
    const analyzer = this.createRuleManager(rule);
    return await analyzer.search(keyword);
  }

  @Post('chapter-by-rule')
  async chapterByRule({ rule, filePath }: { rule: Rule; filePath: string }) {
    const rm = this.createRuleManager(rule);
    const list = await rm.getChapter(filePath);
    return list.map((e: any) => ({
      ...e,
      name: e.name,
      chapterPath: e.url
    }));
  }

  @Post('content-by-rule')
  async contentByRule({ chapterPath, rule }: { rule: Rule; chapterPath: string }) {
    const rm = this.createRuleManager(rule);
    const content: string[] = await rm.getContent(chapterPath);
    let text: string | string[] = '';
    if (rule.contentType === ContentType.VIDEO) text = content?.[0] || '';
    else text = content;

    return {
      contentType: rule.contentType,
      content: text
    };
  }

  @Post('discover-map-by-rule')
  async discoverMapByRule({ rule }: { rule: Rule }) {
    const ruleManager = this.createRuleManager(rule);
    return await ruleManager.discoverMap();
  }

  @Post('discover-by-rule')
  async discoverByRule({ rule, data }: { rule: Rule; data: any }) {
    const ruleManager = this.createRuleManager(rule);
    return await ruleManager.discover(data.value);
  }

  @Post('analyzer-text')
  async analyzerText({ inputText, ruleText, isArray }: { inputText: string; ruleText: string; isArray: boolean }) {
    return isArray ? await this.analyzerManager.getElements(ruleText, inputText) : await this.analyzerManager.getString(ruleText, inputText);
  }

  @Post('analyzer-url')
  async analyzerUrl({ rule, url, keyword }: { url: string; rule: Rule; keyword: string }) {
    return await analyzerUrl(url, keyword, '', rule);
  }

  private async getRule(ruleId: string): Promise<Rule> {
    const rule = await this.db.getResourceRule().findById(ruleId);
    if (!rule) throw new Error('规则不存在');
    return rule;
  }
}

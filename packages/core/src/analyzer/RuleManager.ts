import { ContentType } from '@any-reader/rule-utils';
import type { Rule } from '@any-reader/rule-utils';
import type { AnalyzerManager } from './AnalyzerManager';
import { fetch, parseRequest } from './request';
import { ChapterItem, DiscoverItem, IParser } from '../parser/parser';
import { LogLevel } from '../logger';

const PAGE_PATTERN = /(\$page)|((^|[^a-zA-Z'"_/-])page([^a-zA-Z0-9'"]|$))/;

export class RuleManager implements IParser {
  private rule: Rule;
  private _nextUrl: Map<string, string>;
  private analyzerManager: AnalyzerManager;

  constructor(rule: Rule, analyzerManager: AnalyzerManager) {
    this.rule = rule;
    this._nextUrl = new Map();
    this.analyzerManager = analyzerManager;
    this.JSEngine.init();
    this.JSEngine.setEnvironment({
      host: this.rule.host,
      $host: this.rule.host,
      cookie: this.rule.cookies,
      rule,
      page: 1,
      $page: 1,
      $pageSize: 20,
      searchPage: 1
    });
    this.analyzerManager.logLevel >= LogLevel.Debug && this.analyzerManager.logger.debug(`[初始化规则] ${rule.id} ${rule.name}`);
  }

  private get JSEngine() {
    return this.analyzerManager.JSEngine;
  }

  private async request(params: any) {
    this.analyzerManager.logLevel >= LogLevel.Debug && this.analyzerManager.logger.debug(`[网络请求] -> ${JSON.stringify(params || {})}`);
    const res = await fetch(params);
    this.analyzerManager.logLevel >= LogLevel.Debug && this.analyzerManager.logger.debug(`[网络请求] <- ${String(res.body)}`);
    return res;
  }

  async search(query: string, page = 1, pageSize = 20) {
    // const hasNextUrlRule = this.rule.searchNextUrl !== null && this.rule.searchNextUrl.length > 0;
    this.analyzerManager.logLevel >= LogLevel.Debug && this.analyzerManager.logger.debug(`[搜索] ${query}`);
    let searchRule = '';
    let url = this.rule.searchUrl;

    const re = query.match(/url@.+?@url/s);
    if (re !== null && re[0].length > 0) {
      url = re[0].substring('url@'.length, re[0].length - '@url'.length);
      query = query.substring(re[0].length);
    }

    if (page === 1) {
      searchRule = url;
    }
    // else if (hasNextUrlRule) {
    //   const next = _nextUrl[url];
    //   if (next !== null && next.length > 0) {
    //     searchRule = next;
    //   }
    // }
    else if (PAGE_PATTERN.test(url)) {
      searchRule = url;
    }

    if (searchRule === null) {
      return [];
    }

    let searchUrl = '';
    let body = '';

    this.JSEngine.setEnvironment({
      page,
      $keyword: query,
      keyword: query,
      searchKey: query
    });

    if (this.rule.searchUrl !== 'null') {
      const res = await this.request(parseRequest(await this.analyzerManager.parseJsUrl(searchRule), query, '', this.rule, page, pageSize));
      body = res.body;
      searchUrl = res.params.url as string;
    }

    // if (hasNextUrlRule) {
    //   next = await this.analyzerManager.getString(this.rule.searchNextUrl, body);
    // }

    const list = await this.getList(body, this.rule.searchList);
    const result = [];

    for (const item of list) {
      result.push({
        searchUrl: searchUrl,
        cover: await this.analyzerManager.getString(this.rule.searchCover, item),
        name: (await this.analyzerManager.getString(this.rule.searchName, item)).trim(),
        author: await this.analyzerManager.getString(this.rule.searchAuthor, item),
        chapter: await this.analyzerManager.getString(this.rule.searchChapter, item),
        description: await this.analyzerManager.getString(this.rule.searchDescription, item),
        url: await this.analyzerManager.getUrl(this.rule.searchResult, this.rule.host, item)
      });
    }

    return result;
  }

  async getList(str: string, rule: string) {
    const reversed = rule.startsWith('-');
    const list = await this.analyzerManager.getElements(reversed ? rule.substring(1) : rule, str);
    reversed && list.reverse();
    return list;
  }

  async getChapter(result: string, page = 1): Promise<ChapterItem[]> {
    this.analyzerManager.logLevel >= LogLevel.Debug && this.analyzerManager.logger.debug(`[getChapter] result:${result}`);
    this.JSEngine.setEnvironment({
      result
    });
    if (this.rule.chapterUrl === '正文') {
      return [
        {
          url: result,
          name: this.rule.chapterUrl,
          cover: '',
          time: ''
        }
      ];
    }
    const chapterUrl = this.rule.chapterUrl || result;
    let body = '';

    this.JSEngine.setEnvironment({
      page
    });

    if (chapterUrl !== 'null') {
      const res = await this.request(parseRequest(await this.analyzerManager.parseJsUrl(chapterUrl), '', result, this.rule, page));
      body = res.body;
      this.JSEngine.setEnvironment({
        baseUrl: res.params.url
      });
    }

    this.JSEngine.setEnvironment({
      lastResult: result,
      result: body
    });

    let list = [];
    if (this.rule.enableMultiRoads) {
      // TODO: 多线路
      const roads = await this.analyzerManager.getElements(this.rule.chapterRoads, body);
      // for (const road of roads) {
      const road = roads[0];
      list = await this.getList(road, this.rule.chapterList);
      // }
    } else {
      list = await this.getList(body, this.rule.chapterList);
    }
    const chapterItems: ChapterItem[] = [];
    for (const row of list) {
      chapterItems.push({
        cover: await this.analyzerManager.getString(this.rule.chapterCover, row),
        name: (await this.analyzerManager.getString(this.rule.chapterName, row)).trim(),
        time: await this.analyzerManager.getString(this.rule.chapterTime, row),
        url: await this.analyzerManager.getUrl(this.rule.chapterResult, this.rule.host, row)
      });
    }
    return chapterItems;
  }

  async getContent(lastResult: string): Promise<string[]> {
    this.analyzerManager.logLevel >= LogLevel.Debug && this.analyzerManager.logger.debug(`[getChapter] result:${lastResult}`);

    this.JSEngine.setEnvironment({
      result: lastResult
    });
    const hasNextUrlRule = !!this.rule.contentNextUrl;
    const url = this.rule.contentUrl || lastResult;

    const result: string[] = [];
    let page = 1;
    let contentUrlRule = '';
    let next = '';

    do {
      contentUrlRule = '';
      if (page === 1) {
        contentUrlRule = url;
      } else if (hasNextUrlRule) {
        if (next) {
          contentUrlRule = next;
        }
      } else if (PAGE_PATTERN.test(url)) {
        contentUrlRule = url;
      }

      if (!contentUrlRule) {
        return result;
      }

      try {
        let contentUrl = '';
        let body = '';

        if (contentUrlRule !== 'null') {
          const res = await this.request(parseRequest(await this.analyzerManager.parseJsUrl(contentUrlRule), '', lastResult, this.rule));
          contentUrl = res.params.url;
          body = res.body;
        }

        this.JSEngine.setEnvironment({
          page,
          lastResult: lastResult,
          result: body,
          baseUrl: contentUrl
        });

        if (hasNextUrlRule) {
          next = await this.analyzerManager.getString(this.rule.contentNextUrl, body);
        } else {
          next = '';
        }

        let list = await this.analyzerManager.getStringList(this.rule.contentItems, body);
        if (this.rule.contentType === ContentType.NOVEL) {
          list = list
            .join('\n') // ["1\n\n2", "3"]
            .split('\n')
            .map((e) => e.trim())
            .filter((e) => e);
        }
        result.push(...list);
      } catch (error) {
        console.warn(error);
        break;
      }
      page++;
      // eslint-disable-next-line no-constant-condition
    } while (true);
    return result;
  }

  // 获取获取分类
  async discoverMap() {
    const map: DiscoverItem[] = [];
    const table = new Map();

    let discoverUrl = this.rule.discoverUrl.trimStart();

    if (discoverUrl.startsWith('@js:')) {
      this.JSEngine.setEnvironment({
        page: 1,
        baseUrl: this.rule.host
      });
      discoverUrl = (await this.JSEngine.evaluate(`${discoverUrl.substring(4)};`)) as string;
    }

    const discovers = Array.isArray(discoverUrl)
      ? discoverUrl.map((e) => e.toString())
      : typeof discoverUrl === 'string'
        ? discoverUrl.split(/\n\s*|&&/)
        : [];

    for (const url of discovers) {
      if (url.trim().length === 0) continue;

      const d = url.split('::');
      const ruleValue = d[d.length - 1].trim();
      let tab = '全部';
      let className = '全部';

      if (d.length === 2) {
        tab = d[0].trim();
        className = '全部';
      } else if (d.length === 3) {
        tab = d[0].trim();
        className = d[1].trim();
      }

      if (!table.has(tab)) {
        table.set(tab, map.length);
        map.push({
          name: tab,
          pairs: [
            {
              name: className,
              value: ruleValue
            }
          ]
        });
      } else {
        map[table.get(tab)].pairs.push({
          name: className,
          value: ruleValue
        });
      }
    }

    if (map.length === 0) {
      if (this.rule.host.startsWith('http')) {
        map.push({
          name: '全部',
          pairs: [
            {
              name: '全部',
              value: this.rule.host
            }
          ]
        });
      } else {
        map.push({
          name: 'example',
          pairs: [
            {
              name: 'example',
              value: 'http://example.com/'
            }
          ]
        });
      }
    }

    return map;
  }

  // 获取分类下内容
  async discover(url: string, page = 1) {
    this.JSEngine.setEnvironment({
      result: url
    });
    const hasNextUrlRule = this.rule.discoverNextUrl !== undefined && this.rule.discoverNextUrl.length > 0;
    let discoverRule;

    if (page === 1) {
      discoverRule = url;
    } else if (hasNextUrlRule && page > 1) {
      const next = this._nextUrl.get(url);
      if (next !== undefined && next.length > 0) discoverRule = next;
    } else if (/(\$page)|((^|[^a-zA-Z'"_/-])page([^a-zA-Z0-9'"]|$))/.test(url)) {
      discoverRule = url;
    }

    if (!discoverRule) return [];

    const discoverUrl = '';
    let body = '';

    if (discoverRule !== 'null') {
      const { body: res } = await this.request(parseRequest(await this.analyzerManager.parseJsUrl(discoverRule), '', '', this.rule));
      body = res;
    }

    this.JSEngine.setEnvironment({
      page: 1,
      lastResult: url,
      result: body,
      baseUrl: this.rule.host
    });

    if (hasNextUrlRule) {
      this._nextUrl.set(url, await this.analyzerManager.getString(this.rule.discoverNextUrl as string, body));
    } else {
      this._nextUrl.delete(url);
    }

    const list = await this.getList(body, this.rule.discoverList);
    const result = [];

    for (const item of list) {
      const tag = await this.analyzerManager.getString(this.rule.discoverTags, item);

      let tags: string[] = [];
      if (tag !== undefined && tag.trim() !== '') tags = tag.split(' ').filter((tag) => tag !== '');

      result.push({
        searchUrl: discoverUrl,
        cover: await this.analyzerManager.getString(this.rule.discoverCover, item),
        name: await this.analyzerManager.getString(this.rule.discoverName, item),
        author: await this.analyzerManager.getString(this.rule.discoverAuthor, item),
        chapter: await this.analyzerManager.getString(this.rule.discoverChapter, item),
        description: await this.analyzerManager.getString(this.rule.discoverDescription, item),
        url: await this.analyzerManager.getString(this.rule.discoverResult, item),
        tags
      });
    }

    return result;
  }
}

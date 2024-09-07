import { camelCase } from 'lodash-es';
import { Rule } from '@any-reader/rule-utils';
import { IParser } from './parser';

interface M3UITtem {
  groupTitle: string;
  tvgId: string;
  tvgLogo: string;
  url: string;
}

function m3uParse(text: string): M3UITtem[] {
  return text
    .split('#EXTINF:')
    .map((s: string) => {
      return Array.from(s.matchAll(/ (.*?)="(.*?)"/g)).reduce((p: any, v: string[]) => {
        p[camelCase(v[1])] = v[2];
        const urls = s.split('\n').filter((e) => /^https?:\/\//.test(e));
        if (urls.length === 1) {
          p.url = urls[0];
        }
        return p;
      }, {});
    })
    .filter((e: M3UITtem) => e.url && e.tvgId);
}

export default class IPTV implements IParser {
  private _rule: Rule;
  private _m3u: M3UITtem[] = [];

  constructor(rule: Rule) {
    this._rule = rule;
  }

  async _getM3UList() {
    if (this._m3u.length) return;
    const res = await fetch(this._rule.host).then((e) => e.text());
    this._m3u = m3uParse(res);
  }

  async search() {
    return [];
  }

  async getChapter(result: string) {
    return [
      {
        name: '播放',
        url: result,
        cover: '',
        time: ''
      }
    ];
  }
  async getContent(result: string) {
    return [result];
  }

  // 获取分类
  async discoverMap() {
    await this._getM3UList();
    return this._m3u.reduce((p: any[], v) => {
      const row = p.find((e: any) => e.name === v.groupTitle);
      if (!row) {
        p.push({
          name: v.groupTitle,
          pairs: [
            {
              name: '全部',
              value: JSON.stringify(
                this._m3u
                  .filter((e) => e.groupTitle === v.groupTitle)
                  .map((e) => ({
                    url: e.url,
                    name: e.tvgId,
                    cover: e.tvgLogo,
                    author: '',
                    chapter: '',
                    description: ''
                  }))
              )
            }
          ]
        });
      }
      return p;
    }, []);
  }

  // 分类下列表
  async discover(result: string) {
    return JSON.parse(result);
  }
}

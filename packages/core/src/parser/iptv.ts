import { Rule } from '@any-reader/rule-utils';

interface M3UITtem {
  'group-title': string;
  'tvg-id': string;
  'tvg-logo': string;
  url: string;
}

function m3uParse(text: string): M3UITtem[] {
  return text
    .split('#EXTINF:')
    .map((s: string) => {
      return Array.from(s.matchAll(/ (.*?)="(.*?)"/g)).reduce((p: any, v: string[]) => {
        p[v[1]] = v[2];
        const urls = s.split('\n').filter((e) => /^https?:\/\//.test(e));
        if (urls.length === 1) {
          p.url = urls[0];
        }
        return p;
      }, {});
    })
    .filter((e) => e.url);
}

export default class IPTV {
  private rule: Rule;
  private _m3u: M3UITtem[] = [];

  constructor(rule: Rule) {
    this.rule = rule;
  }

  async _getM3UList() {
    if (this._m3u.length) return;
    const res = await fetch(this.rule.host).then((e) => e.text());
    this._m3u = m3uParse(res);
  }

  async search() {
    return [];
  }
  async getChapter(result: string) {
    return [
      {
        url: result,
        name: '正文'
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
      const row = p.find((e: any) => e.name === v['group-title']);
      if (!row) {
        p.push({
          name: v['group-title'],
          pairs: [
            {
              name: '全部',
              value: v['group-title']
            }
          ]
        });
      }
      return p;
    }, []);
  }

  // 分类下列表
  async discover(result: string) {
    await this._getM3UList();
    return this._m3u
      .filter((e) => e['group-title'] === result)
      .map((e) => ({
        url: e.url,
        name: e['tvg-id'],
        cover: e['tvg-logo']
      }));
  }
}

# any-reader

[![npm version][npm-version-src]][npm-version-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]

阅读规则解析库,目前支持少量[eso 书源](https://github.com/mabDc/eso_source)规则

## 使用

```sh
npm install @any-reader/core
```

```typescript
import { RuleManager, decodeRule } from '@any-reader/core';

const ruleManager = new RuleManager(rule: Rule);
ruleManager.search(keyword: string): SearchItem[]; // 搜索
ruleManager.getChapter(url: string): ChapterItem[]; // 获取章节列表
ruleManager.getContent(url: string): string[]; // 获取内容

decodeRule("eso://") // 可以解码 eso 书源, 得到原始 json
```

- [Rule](https://www.jsdocs.io/package/@any-reader/core#Rule)
- [ChapterItem](https://www.jsdocs.io/package/@any-reader/core#ChapterItem)
- [SearchItem](https://www.jsdocs.io/package/@any-reader/core#SearchItem)

## 书源规则

可以参考[eso](https://github.com/mabDc/eso_source)

### 书源结构

```typescript
export interface Rule {
  host: string; // 根域名
  searchUrl: string; // 搜索地址
  searchList: string; // 搜索列表
  searchCover: string; // 封面
  searchName: string; // 标题
  searchAuthor: string; // 作者
  searchChapter: string; // 章节
  searchDescription: string; // 描述
  searchResult: string; // 搜索结果
  chapterUrl: string; // 章节地址
  chapterName: string; // 标题
  chapterList: string; // 列表
  chapterCover: string; // 封面
  chapterTime: string; // 时间
  chapterResult: string; // 结果
  contentItems: string; // 内容
  id: string; // uuid
  name: string; // 书源名称
  sort: number; // 书源排序
  contentType: ContentType; // 书源类型
  cookies: string;
}

enum ContentType {
  MANGA = 0,
  NOVEL = 1,
  VIDEO = 2,
  AUDIO = 3,
  RSS = 4,
  NOVELMORE = 5,
}
```

### 规则支持情况

- ✅ 理论支持
- ⚠️ 支持部分
- ❌ 理论不支持
- 🚧 开发中

### URL 规则

| 特性 | 支持情况 | 示例                                                                                                       |
| ---- | :------: | ---------------------------------------------------------------------------------------------------------- |
| URL  |    ✅    | `https://xxx.com/search?q=$keyword&pageSize=10`                                                            |
| JSON |    ⚠️    | `{"url":"https://xxx.com/search","method":"post","headers":{"token":"111"},"body":{"keyword":"$keyword"}}` |
| @js  |    ⚠️    | `@js:(() => { return {url, method, body, encoding, headers}; })();`                                        |
| 编码 |    ❌    |                                                                                                            |

#### 变量

| 字段名     | 支持情况 | 说明              |
| ---------- | :------: | ----------------- |
| $keyword   |    ✅    | 搜索用的关键字    |
| searchKey  |    ✅    | 同 `$keyword`     |
| $host      |    ✅    | 替换规则的 `host` |
| $result    |    ✅    |                   |
| lastResult |    ⚠️    |                   |
| searchPage |    ❌    |                   |
| $page      |    ❌    |                   |
| $pageSize  |    ❌    |                   |

> 结果规则会成为下一条地址规则的 `result`，成为下一条除地址规则的 `lastResult`。地址规则的响应会成为其他规则的 `result`

### 取内容规则

| 特性       | 支持情况 | 说明                             | 示例                                    |
| ---------- | :------: | -------------------------------- | --------------------------------------- |
| @css       |    ✅    |                                  | `@css:.box1 .box2@text`                 |
| @json      |    ✅    |                                  | `@json:$.list[:1].title`                |
| @xpath     |    ✅    |                                  | `@xpath://*[@class="box3"]/text()`      |
| @js        |    ⚠️    |                                  |                                         |
| @filter    |    ⚠️    | 模拟浏览器加载地址后匹配指定链接 | `@filter:(?:m3u8\|mp4)(?:$\|/\|\\?\|&)` |
| @replace   |    ⚠️    |                                  | `@replace:.*?url=\|.*?v=`               |
| ##         |    ⚠️    | 正则替换                         | `@css:.c2 a@href##\\d+\\.html`          |
| \{\{\}\}   |    ⚠️    | 拼接                             | `http://www.aaa.com/{{$.id}}`           |
| 嵌套\&组合 |    ⚠️    |                                  | `$.info.body@css:.box1 .box2@text`      |
| \|\|       |    ❌    |                                  |                                         |

规则可以省略开头的,**@css**、**@xpath**、**@json**, 因为解析器会尝试自动识别。

## 开发和调试

1. 修改 `src\start.ts` 文件, 把 `rule` 变量修改为真实的书源
2. vscode 打开调试终端, 输入 `npm run start`


喜欢的话可以点个 `Star`

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@any-reader/core?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/@any-reader/core
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@any-reader/core?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=@any-reader/core
[jsdocs-src]: https://img.shields.io/badge/jsDocs.io-reference-18181B?style=flat&colorA=18181B&colorB=F0DB4F
[jsdocs-href]: https://www.jsdocs.io/package/@any-reader/core

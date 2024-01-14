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

const ruleManager = new RuleManager(rule);
ruleManager.search(keyword: string); // 搜索
ruleManager.getChapter(url: string); // 获取章节列表
ruleManager.getContent(url: string); // 获取内容

decodeRule("eso://") // 可以解码 eso 书源, 得到原始 json
```

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
}
```

### 规则支持情况

- ✅ 理论支持
- ⚠️ 理论支持, 但未经全面测试
- ❌ 理论不支持
- 🚧 开发中

### URL 规则

| 特性      | 支持情况 | 示例                                                                                                       |
| --------- | :------: | ---------------------------------------------------------------------------------------------------------- |
| 简单结构  |    ✅    | `https://xxx.com/search?q=$keyword&pageSize=10`                                                            |
| JSON 结构 |    ⚠️    | `{"url":"https://xxx.com/search","method":"post","headers":{"token":"111"},"body":{"keyword":"$keyword"}}` |
| @js       |    ⚠️    | `@js:(() => { return {url, method, body, encoding, headers}; })();`                                        |
| 编码      |   ❌🚧   |                                                                                                            |

#### 变量

| 字段名     | 支持情况 | 说明                                            |
| ---------- | :------: | ----------------------------------------------- |
| $keyword   |    ✅    | 搜索用的关键字                                  |
| searchKey  |    ✅    | 同 `$keyword`                                   |
| $host      |    ✅    | 替换规则的 `host`                               |
| $result    |    ✅    | 用于替换上一个流程的 `*Result` 规则取出来的结果 |
| searchPage |   ❌🚧   |                                                 |
| $page      |   ❌🚧   |                                                 |
| $pageSize  |   ❌🚧   |                                                 |
| lastResult |   ❌🚧   |                                                 |

### 取内容规则

| 特性       | 支持情况 | 说明     | 示例                               |
| ---------- | :------: | -------- | ---------------------------------- |
| @css       |    ✅    |          | `@css:.box1 .box2@text`            |
| @json      |    ✅    |          | `@json:$.list[:1].title`           |
| @xpath     |    ✅    |          | `@xpath://*[@class="box3"]/text()` |
| @js        |   ❌🚧   |          |                                    |
| ##         |    ⚠️    | 正则替换 | `@css:.c2 a@href##\\d+\\.html`     |
| \{\{\}\}   |    ⚠️    | 拼接     | `http://www.aaa.com/{{$.id}}`      |
| 嵌套\&组合 |    ⚠️    |          | `$.info.body@css:.box1 .box2@text` |
| \|\|       |    ❌    |          |                                    |

规则可以省略开头的,**@css**、**@xpath**、**@json**, 因为解析器会尝试自动识别。

## 开发和调试

1. 修改 `src\start.ts` 文件, 把 `rule` 变量修改为真实的书源
2. vscode 打开调试终端, 输入 `npm run start`

## 相关项目

- [any-reader-vscode](https://github.com/aooiuu/any-reader-vscode) VSCode 插件

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@any-reader/core?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/@any-reader/core
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@any-reader/core?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=@any-reader/core
[jsdocs-src]: https://img.shields.io/badge/jsDocs.io-reference-18181B?style=flat&colorA=18181B&colorB=F0DB4F
[jsdocs-href]: https://www.jsdocs.io/package/@any-reader/core

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
r.search(keyword: string); // 搜索
r.getChapter(url: string); // 获取章节列表
r.getContent(url: string); // 获取内容

decodeRule("eso://") // 可以解码 eso 书源, 得到原始 json
```

## 书源规则

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

规则类型支持情况, 比较忙, 感兴趣的可以参与开发。感谢!

| 类型     | 开发进度 |
| -------- | -------- |
| jsonpath | 50%      |
| css      | 50%      |
| xpath    | 0%       |
| js       | 0%       |

书源不懂的地方可以参考[eso](https://github.com/mabDc/eso_source)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/any-reader?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/any-reader
[bundle-src]: https://img.shields.io/bundlephobia/minzip/any-reader?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=any-reader
[jsdocs-src]: https://img.shields.io/badge/jsDocs.io-reference-18181B?style=flat&colorA=18181B&colorB=F0DB4F
[jsdocs-href]: https://www.jsdocs.io/package/any-reader

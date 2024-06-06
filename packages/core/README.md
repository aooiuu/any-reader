# any-reader

[![npm version][npm-version-src]][npm-version-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]

书源规则解析库 [查看文档](https://aooiuu.github.io/any-reader/core/)

## 使用

```sh
npm install @any-reader/core
```

```typescript
import { RuleManager } from '@any-reader/core';

const ruleManager = new RuleManager(rule: Rule);
ruleManager.search(keyword: string): SearchItem[]; // 搜索
ruleManager.getChapter(url: string): ChapterItem[]; // 获取章节列表
ruleManager.getContent(url: string): string[]; // 获取内容
```

- [Rule](https://www.jsdocs.io/package/@any-reader/core#Rule)
- [ChapterItem](https://www.jsdocs.io/package/@any-reader/core#ChapterItem)
- [SearchItem](https://www.jsdocs.io/package/@any-reader/core#SearchItem)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@any-reader/core?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/@any-reader/core
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@any-reader/core?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=@any-reader/core
[jsdocs-src]: https://img.shields.io/badge/jsDocs.io-reference-18181B?style=flat&colorA=18181B&colorB=F0DB4F
[jsdocs-href]: https://www.jsdocs.io/package/@any-reader/core

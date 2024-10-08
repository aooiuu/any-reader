---
outline: deep
---

# 规则解析库

[规则](/rule/) 解析库，规则的具体实现, 您也可以使用本库实现自己的程序。

> 为了避免重复造轮子、重复制定规则规范, 目前 `any-reader` 的规则规范是按照 `eso` 的规则实现的, 所以规则的编写方法您可以参考 [eso](https://github.com/mabDc/eso), 目前 `any-reader` 也支持 [eso](https://github.com/mabDc/eso) 规则

## 使用

```sh
npm install @any-reader/core
```

```typescript
import { createRuleManager } from '@any-reader/core';

const ruleManager = createRuleManager(rule: Rule);
ruleManager.search(keyword: string): SearchItem[]; // 搜索
ruleManager.getChapter(url: string): ChapterItem[]; // 获取章节列表
ruleManager.getContent(url: string): string[]; // 获取内容
```

- [Rule](https://www.jsdocs.io/package/@any-reader/core#Rule)
- [ChapterItem](https://www.jsdocs.io/package/@any-reader/core#ChapterItem)
- [SearchItem](https://www.jsdocs.io/package/@any-reader/core#SearchItem)

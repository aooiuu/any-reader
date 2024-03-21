---
outline: deep
---

# @any-reader/core

[规则](/rule/) 解析库

> 为了避免重复造轮子, 重复制定规则规范, 目前 `any-reader` 的规则规范是按照 `eso` 的规则实现的, 所以规则的编写方法您可以参考 [eso 书源](https://github.com/mabDc/eso_source), 目前 `any-reader` 也支持少量 [eso 书源](https://github.com/mabDc/eso_source) 规则

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

## 规则支持情况

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
| `@css`     |    ✅    |                                  | `@css:.box1 .box2@text`                 |
| `@json`    |    ✅    |                                  | `@json:$.list[:1].title`                |
| `@xpath`   |    ✅    |                                  | `@xpath://*[@class="box3"]/text()`      |
| `@js`      |    ⚠️    |                                  |                                         |
| `@filter`  |    ⚠️    | 模拟浏览器加载地址后匹配指定链接 | `@filter:(?:m3u8\|mp4)(?:$\|/\|\\?\|&)` |
| `@replace` |    ⚠️    |                                  | `@replace:.*?url=\|.*?v=`               |
| `##`       |    ⚠️    | 正则替换                         | `@css:.c2 a@href##\\d+\\.html`          |
| `{‍{}}`    |    ⚠️    | 拼接                             | `http://www.aaa.com/{‍{$.id}}`          |
| 嵌套组合   |    ⚠️    |                                  | `$.info.body@css:.box1 .box2@text`      |
| `\|\|`     |    ❌    |                                  |                                         |

规则可以省略开头的,**@css**、**@xpath**、**@json**, 因为解析器会尝试自动识别。

## 开发和调试

1. 修改 `src\start.ts` 文件, 把 `rule` 变量修改为真实的书源
2. vscode 打开调试终端, 输入 `npm run start`

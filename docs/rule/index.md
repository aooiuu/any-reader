---
outline: deep
---

# 规则说明

通过编写规则, 可以把不同网站的内容以相同的格式呈现, 以实现聚合搜索或阅读的功能。

> 为了避免重复造轮子、重复制定规则规范, 目前 `any-reader` 的规则规范是按照 `eso` 的规则实现的, 所以规则的编写方法您可以参考 [eso 书源](https://github.com/mabDc/eso_source), 目前 `any-reader` 也支持少量 [eso 书源](https://github.com/mabDc/eso_source) 规则

## 规则结构

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

## 解析流程

### 搜索小说

1. 通过 `host` 和 `searchUrl` 字段获取请求地址、方式、参数等
2. 通过 `searchList` 字段获取搜索结果列表数组
3. 通过 `searchCover`、 `searchName`、 `searchAuthor`、 `searchChapter`、 `searchDescription` 字段获取每单个搜索结果的具体内容
4. 通过 `searchResult` 字段匹配数据以用来给 `获取章节数据` 使用

### 获取章节数据

1. 通过 `host`、`chapterUrl`、`searchResult` 字段获取请求地址、方式、参数等
2. 通过 `chapterList` 字段获取章节列表数组
3. 通过 `chapterName`、 `chapterCover`、 `chapterTime` 字段获取单个章节的具体内容
4. 通过 `chapterResult` 字段匹配数据以用来给 `获取内容` 使用

### 获取内容

1. 通过 `host`、`contentItems`、`chapterResult` 字段获取请求地址、方式、参数等
2. 通过 `contentType` 按类型解析内容

## 规则类型

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
| `{‍​‍{}}`  |    ⚠️    | 拼接                             | `http://www.aaa.com/{‍{$.id}}`          |
| 嵌套组合   |    ⚠️    |                                  | `$.info.body@css:.box1 .box2@text`      |
| `\|\|`     |    ❌    |                                  |                                         |

规则可以省略开头的,**@css**、**@xpath**、**@json**, 因为解析器会尝试自动识别。

## 规则表达式

### CSS

例子: `@css:.box1 .box2@text`

该类规则分为 2 部分，以 `@` 符号分割.

> 前部分与 CSS 标准一致，可省略（表示取根节点）.
> 后部分则是 APP 自定义行为, 包括 text、html、innerHtml、outerHtml 取文本，src、href、data-original、bid 等取属性。

### XPath

例子: `@xpath://*[@class="box3"]/text()`

[XPath 文档](https://developer.mozilla.org/zh-CN/docs/Web/XPath)

[XPath 测试工具](https://extendsclass.com/xpath-tester.html)

### JSONPath

例子: `@json:$.list[:1].title`

[文档](https://github.com/JSONPath-Plus/JSONPath)

[JSONPath 测试工具](https://jsonpath-plus.github.io/JSONPath/demo/)

### JavaScript

### 正则

例子: `rule##match##replacement##replaceFirstFlag`

其中 `replacement` 和 `replaceFirstFlag` 均可以省略。

### 拼接

例子: `aa{‍​‍{rule1}}bb{‍​‍{rule2}}cc`

使用 `{‍​‍{}}` 对结果进行拼接。

### 级联

例子: `$.html@css:html`

`@` 分割规则后，第一个部分为 `JSONPath`, 使用 `JSONPath` 解析后继续用第二部分的 `css` 规则解析拿到最终结果

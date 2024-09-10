---
outline: deep
---

# 规则说明

通过编写规则, 可以把不同网站的内容以相同的格式呈现, 以实现聚合搜索或阅读的功能。

> 为了避免重复造轮子、重复制定规则规范, 目前 `any-reader` 的规则规范是按照 `eso` 的规则实现的, 所以规则的编写方法您可以参考 [eso](https://github.com/mabDc/eso), 目前 `any-reader` 也支持 [eso](https://github.com/mabDc/eso) 规则

## 规则结构

::: code-group

```json
{
  "id": "xxx-xxx-xxx-xxx-xxx",
  "author": "",
  "name": "",
  "host": "",
  "icon": "",
  "contentType": 1,
  "sort": 0,
  "userAgent": "",
  "enableDiscover": false,
  "discoverUrl": "",
  "discoverNextUrl": "",
  "discoverList": "",
  "discoverTags": "",
  "discoverName": "",
  "discoverCover": "",
  "discoverChapter": "",
  "discoverDescription": "",
  "discoverResult": "",
  "enableSearch": false,
  "searchUrl": "",
  "searchAuthor": "",
  "chapterCover": "",
  "chapterTime": "",
  "discoverAuthor": "",
  "searchList": "",
  "searchTags": "",
  "searchName": "",
  "searchCover": "",
  "searchChapter": "",
  "searchDescription": "",
  "searchResult": "",
  "enableMultiRoads": false,
  "chapterRoads": "",
  "chapterRoadName": "",
  "chapterUrl": "",
  "chapterNextUrl": "",
  "chapterList": "",
  "chapterName": "",
  "chapterResult": "",
  "contentUrl": "",
  "contentNextUrl": "",
  "contentItems": ""
}
```

```typescript
export interface Rule {
  // ===== 通用字段 =====
  host: string; // 域名
  id: string; // uuid
  name: string; // 书源名称
  sort: number; // 书源排序
  contentType: ContentType; // 书源类型
  loadJs: string; // 全局JS脚本
  author: string; // 规则作者
  userAgent: string; // Headers JSON字符串

  // ===== 解析流程 - 搜索 =====
  enableSearch: boolean; // 搜索 - 启用
  searchUrl: string; // 搜索 - 地址
  searchList: string; // 搜索 - 列表
  searchCover: string; // 搜索 - 封面
  searchName: string; // 搜索 - 标题
  searchAuthor: string; // 搜索 - 作者
  searchChapter: string; // 搜索 - 章节
  searchDescription: string; // 搜索 - 描述
  searchResult: string; // 搜索 - 结果

  // ===== 解析流程 - 章节列表 =====
  chapterUrl: string; // 章节列表 - 请求地址
  chapterName: string; // 章节列表 - 标题
  chapterList: string; // 章节列表 - 列表
  chapterCover: string; // 章节列表 - 封面
  chapterTime: string; // 章节列表 - 时间
  chapterResult: string; // 章节列表 - 结果
  contentItems: string; // 章节列表 - 内容
  enableMultiRoads: boolean; // 启用多线路 暂不支持
  chapterRoads: string; // 线路列表 暂不支持
  chapterNextUrl: string; // 章节列表下一页地址

  // ===== 解析流程 - 发现页 =====
  enableDiscover: boolean; // 发现页 - 是否启用
  discoverUrl: string; // 发现页 - 请求地址
  discoverList: string; // 发现页 - 列表
  discoverName: string; // 发现页 - 标题
  discoverCover: string; // 发现页 - 封面
  discoverAuthor: string; // 发现页 - 作者
  discoverDescription: string; // 发现页 - 描述
  discoverResult: string; // 发现页 - 结果
  // discoverItems: string
  discoverTags: string;
  discoverChapter: string;
  discoverNextUrl: string; // 下一页地址

  // ===== 解析流程 - 正文 =====
  contentUrl: string;
  contentNextUrl: string;
}

enum ContentType {
  MANGA = 0, // 漫画
  NOVEL = 1, // 小说
  VIDEO = 2, // 视频
  AUDIO = 3, // 音频
  RSS = 4,
  NOVELMORE = 5
}
```

> 格式 `eso://:xxxxx` 是压缩后的规则, 软件也会自动识别, 也可以使用命令工具解码还原成json
> 并不是每个字段都是必填的, 按需填写既可。

:::

## 规则字段类型

### URL地址规则

字段名通常后面有 `Url`, 比如 `searchUrl` `chapterUrl`。 这类规则通常用来请求网络获取数据

地址规则的几种写法:

| 特性 | 示例                                                                                                       |
| ---- | ---------------------------------------------------------------------------------------------------------- |
| URL  | `https://xxx.com/search?q=$keyword&pageSize=10`                                                            |
| JSON | `{"url":"https://xxx.com/search","method":"post","headers":{"token":"111"},"body":{"keyword":"$keyword"}}` |
| @js  | `@js:(() => { return {url, method, body, headers}; })();`                                                  |

### 取列表规则

有了网络请求的数据, 那么下一步一般是用来获取列表。

这类规则一般用于从 `URL地址规则` 的结果提取内容。

字段名通常后面有 `List`, 比如 `searchList` `chapterList`。

拿到的结果通常是一个**数组**

> 列表规则也可以通过 `@js` 规则 `fetch` 等接口发起请求获取数据

### 取内容规则

有了列表数组的数据, 那么下一步一般是需要获取具体的字段内容, 比如书名、作者。

这类规则通常用来从`列表规则`的结果获取具体的某项内容，

> 图片字段可以使用 `@headers` 携带请求头 (目前仅桌面端支持)
>
> 比如: `https://xxx.jpg@headers{"xxx":"xxx"}`

### 结果规则

字段名通常后面有 `Result`, 比如 `searchResult` `chapterResult`。

这类规则一般用于从`列表规则`的结果获取内容供下一个流程的 `URL地址规则` 使用。

比如搜索时，`searchResult` 拿到的结果将会给获取章节列表的流程使用，获取章节列表的URL规则里可以使用 `result` 变量拿到 `searchResult` 的结果。

> **结果规则**的结果会成为下一个解析流程**URL地址规则**的 `result` 变量，成为下一个解析流程**URL地址规则**外其它规则的 `lastResult` 变量。
>
> **URL地址规则**的结果会成为当前解析流程其他规则的 `result` 变量

## 解析流程

### 搜索

1. 通过 `host` 和 `searchUrl` 获取数据
2. 通过 `searchList` 字段获取搜索结果列表数组
3. 通过 `searchCover`、 `searchName`、 `searchAuthor`、 `searchChapter`、 `searchDescription` 字段获取每单个搜索结果的具体内容
4. 通过 `searchResult` 字段匹配数据以用来给 `获取章节列表` 使用

### 获取章节列表

1. 通过 `host`、`chapterUrl`、`searchResult` 获取数据
2. 通过 `chapterList` 字段获取章节列表数组
3. 通过 `chapterName`、 `chapterCover`、 `chapterTime` 字段获取单个章节的具体内容
4. 通过 `chapterResult` 字段匹配数据以用来给 `获取内容` 使用

### 获取内容

1. 通过 `host`、`contentItems`、`chapterResult` 获取数据
2. 通过 `contentType` 按类型解析内容

### 发现页分类

通过 `discoverUrl` 处理, 例子:

::: code-group

```[简单例子]
分类名1::url1
分类名2::url2
分类名3::url3
```

```[多级分类]
分组1::分类名1::url1
分组1::分类名2::url2
分组1::分类名3::url3
分组2::分类名1::url4
分组2::分类名2::url5
分组2::分类名3::url6
```

```javascript [javascript]
@js:(() => {
  return [
    '分组1::分类名1::url1',
    '分组1::分类名2::url2',
    '分组1::分类名3::url3',
    '分组2::分类名1::url4',
    '分组2::分类名2::url5',
    '分组2::分类名3::url6'
  ];
})();
```

:::

### 发现页列表

1. 通过 发现页分类 的 url 获取数据
2. 通过 `discoverList` 字段获取列表数组
3. 通过 `discoverName`、 `discoverCover`、 `discoverAuthor` 等字段获取单个章节的具体内容
4. 通过 `discoverResult` 字段匹配数据以用来给 `获取内容` 使用

## 规则支持情况

- ✅ 理论支持
- ⚠️ 支持部分
- ❌ 暂不支持

### URL地址规则

| 特性 | 支持情况 | 示例                                                                                                       |
| ---- | :------: | ---------------------------------------------------------------------------------------------------------- |
| URL  |    ✅    | `https://xxx.com/search?q=$keyword&pageSize=10`                                                            |
| JSON |    ✅    | `{"url":"https://xxx.com/search","method":"post","headers":{"token":"111"},"body":{"keyword":"$keyword"}}` |
| @js  |    ✅    | `@js:(() => { return {url, method, body, encoding, headers}; })();`                                        |

#### 变量

| 字段名     | 支持情况 | 说明                         |
| ---------- | :------: | ---------------------------- |
| $keyword   |    ✅    | 搜索用的关键字               |
| searchKey  |    ✅    | 同 `$keyword` , ⚠️不推荐使用 |
| $host      |    ✅    | 替换规则的 `host`            |
| $result    |    ✅    | 上一个步骤 result 字段的结果 |
| lastResult |    ✅    |                              |
| searchPage |    ❌    |                              |
| $page      |    ❌    |                              |
| $pageSize  |    ❌    |                              |

### 取内容规则

| 特性       | 支持情况 | 说明                             | 示例                                    |
| ---------- | :------: | -------------------------------- | --------------------------------------- |
| `@css`     |    ✅    |                                  | `@css:.box1 .box2@text`                 |
| `@json`    |    ✅    |                                  | `@json:$.list[:1].title`                |
| `@xpath`   |    ✅    |                                  | `@xpath://*[@class="box3"]/text()`      |
| `@js`      |    ✅    |                                  |                                         |
| `@filter`  |    ✅    | 模拟浏览器加载地址后匹配指定链接 | `@filter:(?:m3u8\|mp4)(?:$\|/\|\\?\|&)` |
| `@replace` |    ✅    |                                  | `@replace:.*?url=\|.*?v=`               |
| `##`       |    ✅    | 正则替换                         | `@css:.c2 a@href##\\d+\\.html`          |
| `{‍​‍{}}`  |    ✅    | 使用变量                         | `http://www.aaa.com/{‍{$.id}}`          |
| 嵌套组合   |    ✅    |                                  | `$.info.body@css:.box1 .box2@text`      |
| `\|\|`     |    ✅    |                                  |                                         |
| `&&`       |    ✅    |                                  |                                         |

规则可以省略开头的,**@css**、**@xpath**、**@json**, 因为解析器会尝试自动识别。

## 规则表达式

### CSS

例子: `@css:.box1 .box2@text`

该类规则分为 2 部分，以 `@` 符号分割.

> 前部分与 CSS 标准一致，可省略（表示取根节点）.
> 后部分则是软件自定义行为, 包括 text、html、innerHtml、outerHtml 取文本，src、href、data-original、bid 等取属性。

### XPath

例子: `@xpath://*[@class="box3"]/text()`

[XPath 文档](https://developer.mozilla.org/zh-CN/docs/Web/XPath)

[XPath 测试工具](https://extendsclass.com/xpath-tester.html)

### JSONPath

例子: `@json:$.list[:1].title`

[文档](https://github.com/JSONPath-Plus/JSONPath)

[JSONPath 测试工具](https://jsonpath-plus.github.io/JSONPath/demo/)

### JavaScript

例子: `@js:1+1`

> 可以搭配解析流程产生的变量使用, 比如 `result`、`lastResult`
>
> 如果`URL地址规则`拿到的结果是 `123`, 那么在非`URL地址规则`字段中 `@js:result` 将输出 `123`
>
> 如果上一个流程`结果规则`拿到的结果是 `456`, 那么在非`URL地址规则`字段中 `@js:lastResult` 将输出 `456`, 在`URL地址规则`字段中 `@js:result` 将输出 `456`

内置方法: `CryptoJS`、`fetch`、`xpath`

#### CryptoJS

https://github.com/brix/crypto-js

```javascript
@js:CryptoJS.AES.decrypt('U2FsdGVkX1+lzrvaz1MagYswnfRUePbcwyo+fZ90+Qs=', "secret key 123").toString(CryptoJS.enc.Utf8)

// -> hello word
```

> 使用变量

```javascript
@js:CryptoJS.AES.decrypt(result, "secret key 123").toString(CryptoJS.enc.Utf8)
```

#### fetch

https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API

```javascript
@js:(async() => fetch('https://api.github.com/').then(e => e.text()))()
```

#### xpath

```javascript
@js:(async() => {
  return await xpath('<div class="box1"><div class="box2">content2</div><div class="box3">content3</div></div>', '//*[@class="box3"]/text()')
})()

// -> content3
```

#### cheerio

https://github.com/cheeriojs/cheerio/wiki/Chinese-README

```javascript
@js:(() => cheerio.load(result)('h2.title').text())()
```

### 正则

例子: `rule##match##replacement##replaceFirstFlag`

其中 `replacement` 和 `replaceFirstFlag` 均可以省略。

### 变量

例子: `aa{‍​‍{rule1}}bb{‍​‍{rule2}}cc`

### 级联

例子: `$.html@css:html`

`@` 分割规则后，第一个部分为 `JSONPath`, 使用 `JSONPath` 解析后继续用第二部分的 `css` 规则解析拿到最终结果

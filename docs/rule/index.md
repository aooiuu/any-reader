---
outline: deep
---

# 规则说明

通过编写规则, 可以把不同网站的内容以相同的格式呈现, 以实现聚合搜索或阅读的功能。

> 为了避免重复造轮子、重复制定规则规范, 目前 `any-reader` 的规则规范是按照 `eso` 的规则实现的, 所以规则的编写方法您可以参考 [eso](https://github.com/mabDc/eso), 目前 `any-reader` 也支持 [eso](https://github.com/mabDc/eso) 规则

## 规则结构

::: details 规则结构

::: code-group

<<< ./rule-tpl.ts [带注释的]
<<< ./rule-tpl.json5 [json]

:::

::: details 字段太多看着很复杂?

并不是每个字段都是必填的, 按需填写既可。

以搜索为例, 实际上只用实现以下几个关键字段。

```json5
{
  "host": "", // 域名
  "contentType": 1, // 规则类型, 告诉软件这是小说还是漫画还是视频
  "enableSearch": true, // 开启搜索功能

  "searchUrl": "", // 搜索请求地址
  "searchList": "", // 搜索列表
  "searchName": "", // 每一个书或者视频的名称
  "searchResult": "", // 用于给下一个流程使用, 一般是章节列表地址

  "chapterList": "", // 章节列表
  "chapterName": "", // 章节名
  "chapterResult": "", // 用于给下一个流程使用, 一般是正文地址

  "contentItems": "" // 正文
}
```

:::

> 格式 `eso://:xxxxx` 是压缩后的规则, 软件也会自动识别, 也可以使用 [在线规则编解码工具](/play/comparess) 还原成json

## 规则字段类型

### URL地址规则

相关字段: `searchUrl`、`chapterUrl`, 常用来请求网络获取数据

地址规则的几种写法:

| 特性 | 示例                                                                                                       |
| ---- | ---------------------------------------------------------------------------------------------------------- |
| URL  | `https://xxx.com/search?q=$keyword&pageSize=10`                                                            |
| JSON | `{"url":"https://xxx.com/search","method":"post","headers":{"token":"111"},"body":{"keyword":"$keyword"}}` |
| @js  | `@js:(() => { return {url, method, body, headers}; })();`                                                  |

::: details 例子1 - 简单的GET请求

输入:

```http
https://xxx.com/search?q=$keyword&pageSize=10
```

效果:

```http
GET https://xxx.com/search?q=$keyword&pageSize=10
```

> 在搜索流程里, `$keyword` 会被转换为搜索的关键字

:::

::: details 例子2 - POST 请求

输入:

```JSON
{"url":"https://xxx.com/search","method":"post","headers":{"token":"111"},"body":{"keyword":"$keyword"}}
```

效果:

```http
POST https://xxx.com/search HTTP/1.1
token: 111
Content-Type: application/json

{"keyword": "$keyword"}
```

:::

::: details 例子3 - 复杂点的可以用JS获取请求参数

输入:

```javascript
@js:(() => {
  // 处理一些事情
  return { url: 'https://xxx.com/search', method: 'post', headers: { token: '111' }, body: { keyword: '$keyword' } };
})();
```

效果:

```http
POST https://xxx.com/search HTTP/1.1
token: 111
Content-Type: application/json

{"keyword": "$keyword"}
```

:::

### 取列表规则

相关字段: `searchList`、`chapterList`、`discoverList`

有了网络请求的数据, 那么下一步一般是用来获取列表。一般用于从 `URL地址规则` 的结果提取内容。

拿到的结果通常是一个**数组**

> 列表规则也可以通过 `@js` 规则 `fetch` 等接口发起请求获取数据

::: details 例子1 `@css` 从 `URL规则` 结果获取

假如URL规则拿到的结果:

```html
<html>
  <!--  -->
  <ul id="xxxlist">
    <li>
      <p class="q">
        <a href="http://xxx.xxx/book/xxxx/" target="_blank">名字1</a>
      </p>
      <p class="a">
        <a href="/xxx/xxxx.html" target="_blank">空空如也。</a>
      </p>
      <p class="b">张三</p>
      <p class="c">99k</p>
      <p class="d">连载中</p>
      <p class="e">24-01-01</p>
    </li>

    <li>
      <p class="q">
        <a href="http://xxx.xxx/book/xxx1/" target="_blank">名字2</a>
      </p>
      <p class="a">
        <a href="/xxx/xxx1.html" target="_blank">空空如也。</a>
      </p>
      <p class="b">李四</p>
      <p class="c">99k</p>
      <p class="d">连载中</p>
      <p class="e">24-01-02</p>
    </li>
    <!--  -->
  </ul>
  <!--  -->
</html>
```

规则:

```css
#xxxlist li
```

[规则测试](/play/#eyJpbnB1dFRleHQiOiI8aHRtbD4gICA8IS0tICAtLT4gICA8dWwgaWQ9XCJ4eHhsaXN0XCI+ICAgICA8bGk+ICAgICAgIDxwIGNsYXNzPVwicVwiPiAgICAgICAgIDxhIGhyZWY9XCJodHRwOi8veHh4Lnh4eC9ib29rL3h4eHgvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+5ZCN5a2XMTwvYT4gICAgICAgPC9wPiAgICAgICA8cCBjbGFzcz1cImFcIj4gICAgICAgICA8YSBocmVmPVwiL3h4eC94eHh4Lmh0bWxcIiB0YXJnZXQ9XCJfYmxhbmtcIj7nqbrnqbrlpoLkuZ/jgII8L2E+ICAgICAgIDwvcD4gICAgICAgPHAgY2xhc3M9XCJiXCI+5byg5LiJPC9wPiAgICAgICA8cCBjbGFzcz1cImNcIj45OWs8L3A+ICAgICAgIDxwIGNsYXNzPVwiZFwiPui/nui9veS4rTwvcD4gICAgICAgPHAgY2xhc3M9XCJlXCI+MjQtMDEtMDE8L3A+ICAgICA8L2xpPiAgICAgIDxsaT4gICAgICAgPHAgY2xhc3M9XCJxXCI+ICAgICAgICAgPGEgaHJlZj1cImh0dHA6Ly94eHgueHh4L2Jvb2sveHh4MS9cIiB0YXJnZXQ9XCJfYmxhbmtcIj7lkI3lrZcyPC9hPiAgICAgICA8L3A+ICAgICAgIDxwIGNsYXNzPVwiYVwiPiAgICAgICAgIDxhIGhyZWY9XCIveHh4L3h4eDEuaHRtbFwiIHRhcmdldD1cIl9ibGFua1wiPuepuuepuuWmguS5n+OAgjwvYT4gICAgICAgPC9wPiAgICAgICA8cCBjbGFzcz1cImJcIj7mnY7lm5s8L3A+ICAgICAgIDxwIGNsYXNzPVwiY1wiPjk5azwvcD4gICAgICAgPHAgY2xhc3M9XCJkXCI+6L+e6L295LitPC9wPiAgICAgICA8cCBjbGFzcz1cImVcIj4yNC0wMS0wMjwvcD4gICAgIDwvbGk+ICAgICA8IS0tICAtLT4gICA8L3VsPiAgIDwhLS0gIC0tPiA8L2h0bWw+IiwicnVsZSI6IiN4eHhsaXN0IGxpIiwiaXNMaXN0Ijp0cnVlfQ==)

> 规则用法可以参考下面的 `规则表达式`
>
> 这里使用的是默认的 `@css`, `#xxxlist li` 效果类似于 `document.querySelectorAll('#xxxlist li')`
>
> 也可以使用 `xpath` `js` 等方式去获取, `规则表达式` 里有介绍

:::

::: details 例子2 `@js` 网络请求

不通过 `URL地址规则` 获取内容, 直接通过`js`获取

```javascript
@js:(async () => {
  return await fetch('https://api.github.com/gists/public').then((e) => e.text());
})()
```

:::

::: details 例子3 `@js` 不需要网络请求

不通过 `URL地址规则` 获取内容, 直接通过`js`获取

```javascript
@js:[{
  a: 1,
  b: 2
  // ...
}]
```

:::

### 取内容规则

有了列表数组的数据, 那么下一步一般是需要获取具体的字段内容, 比如书名、作者。

这类规则通常用来从`列表规则`的结果获取具体的某项内容，

> 图片字段可以使用 `@headers` 携带请求头 (目前仅桌面端支持)
>
> 比如: `https://xxx.jpg@headers{"xxx":"xxx"}`

::: details 例子1

假设列表规则拿到的数组每一项内容是这样的:

```html
<li>
  <p class="q">
    <a href="http://xxx.xxx/book/xxxx/" target="_blank">名字1</a>
  </p>
  <p class="a">
    <a href="/xxx/xxxx.html" target="_blank">空空如也。</a>
  </p>
  <p class="b">张三</p>
  <p class="c">99k</p>
  <p class="d">连载中</p>
  <p class="e">24-01-01</p>
</li>
```

规则:

```json5
{
  searchName: '.q a@text', // 名字1
  searchAuthor: '.b@text', // 张三
  searchResult: '.q a@href' // http://xxx.xxx/book/xxxx/
}
```

[规则测试](/play/#eyJpbnB1dFRleHQiOiI8bGk+ICAgPHAgY2xhc3M9XCJxXCI+ICAgICA8YSBocmVmPVwiaHR0cDovL3h4eC54eHgvYm9vay94eHh4L1wiIHRhcmdldD1cIl9ibGFua1wiPuWQjeWtlzE8L2E+ICAgPC9wPiAgIDxwIGNsYXNzPVwiYVwiPiAgICAgPGEgaHJlZj1cIi94eHgveHh4eC5odG1sXCIgdGFyZ2V0PVwiX2JsYW5rXCI+56m656m65aaC5Lmf44CCPC9hPiAgIDwvcD4gICA8cCBjbGFzcz1cImJcIj7lvKDkuIk8L3A+ICAgPHAgY2xhc3M9XCJjXCI+OTlrPC9wPiAgIDxwIGNsYXNzPVwiZFwiPui/nui9veS4rTwvcD4gICA8cCBjbGFzcz1cImVcIj4yNC0wMS0wMTwvcD4gPC9saT4iLCJydWxlIjoiLnEgYUB0ZXh0IiwiaXNMaXN0IjpmYWxzZX0=)

:::

### 结果规则

字段名通常后面有 `Result`, 比如 `searchResult` `chapterResult`。

这类规则一般用于从`列表规则`的结果获取内容供下一个流程的 `URL地址规则` 使用。

比如搜索时，`searchResult` 拿到的结果将会给获取章节列表的流程使用，获取章节列表的URL规则里可以使用 `result` 变量拿到 `searchResult` 的结果。

> **结果规则**的结果会成为下一个解析流程**URL地址规则**的 `result` 变量，成为下一个解析流程**取列表规则**的 `lastResult` 变量。

### 发现页分类规则

`discoverUrl` 例子:

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

> `discoverUrl` 虽然规则看起来像 `URL地址规则`, 但是用法截然不同, 所以这里单独说明

## 规则表达式

[在线练习](/play/)

<!--@include: ./expression.md-->

---

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
> 如果`URL地址规则`拿到的结果是 `123`, 那么在`取列表规则`字段中 `@js:result` 将输出 `123`
>
> 如果上一个流程`结果规则`拿到的结果是 `456`, 那么在`取列表规则`字段中 `@js:lastResult` 将输出 `456`, 在`URL地址规则`字段中 `@js:result` 将输出 `456`

内置方法: `CryptoJS`、`fetch`、`xpath`、`cheerio`

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

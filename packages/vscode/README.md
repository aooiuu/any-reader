# any-reader-vscode

> 一个可以自定义书源的看书插件, 书源解析基于[any-reader](https://github.com/aooiuu/any-reader)

点个 `star` 可以关注插件更新动态, 也欢迎大家提交 `PR`.

<p align="center">
  <a href="https://github.com/aooiuu/any-reader-vscode">
    <img
      src="https://img.shields.io/visual-studio-marketplace/v/aooiu.any-reader"
      alt=""
    />
  </a>
  <a href="https://github.com/aooiuu/any-reader-vscode">
    <img
      src="https://img.shields.io/visual-studio-marketplace/d/aooiu.any-reader"
      alt=""
    />
  </a>
    <a href="https://github.com/aooiuu/any-reader-vscode">
    <img
      src="https://img.shields.io/visual-studio-marketplace/i/aooiu.any-reader"
      alt=""
    />
  </a>
  <a href="https://github.com/aooiuu/any-reader-vscode">
    <img src="https://img.shields.io/github/stars/aooiuu/any-reader" alt="" />
  </a>
  <a href="https://github.com/aooiuu/any-reader-vscode">
    <img src="https://img.shields.io/github/forks/aooiuu/any-reader" alt="" />
  </a>
  <a href="https://github.com/aooiuu/any-reader-vscode">
    <img src="https://img.shields.io/github/issues/aooiuu/any-reader" alt="" />
  </a>
</p>

## 预览

![1](https://github.com/aooiuu/any-reader-vscode/assets/28108111/fff2e255-5e09-4bff-b45c-78070dce8afc)
![2](https://github.com/aooiuu/any-reader/assets/28108111/ed5544d6-ec4f-4b52-a75a-a1f618b8383d)

## 使用方式

1. 安装插件后, 插件入口会出现在 `VSCode` 侧边栏
2. 打开插件侧边栏上面有 `书源编辑` 按钮, 点击后可以配置源
3. 配置好源后, 侧栏列表会出现配置好的源。

### 源格式

```json
[
  {
    "searchUrl": "",
    "host": "",
    "searchList": "",
    "searchCover": "",
    "searchName": "",
    "searchAuthor": "",
    "searchChapter": "",
    "searchDescription": "",
    "searchResult": "",
    "chapterUrl": "",
    "chapterName": "",
    "chapterList": "",
    "chapterCover": "",
    "chapterTime": "",
    "chapterResult": "",
    "contentItems": "",
    "id": "",
    "name": "",
    "sort": "",
    "contentType": "",
    "cookies": ""
  },
  {
    "searchUrl": "",
    "host": "",
    "searchList": "",
    "searchCover": "",
    "searchName": "",
    "searchAuthor": "",
    "searchChapter": "",
    "searchDescription": "",
    "searchResult": "",
    "chapterUrl": "",
    "chapterName": "",
    "chapterList": "",
    "chapterCover": "",
    "chapterTime": "",
    "chapterResult": "",
    "contentItems": "",
    "id": "",
    "name": "",
    "sort": "",
    "contentType": "",
    "cookies": ""
  }
]
```

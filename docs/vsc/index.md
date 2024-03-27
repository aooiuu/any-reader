---
outline: deep
---

# any-reader-vscode

一个可以自定义 [规则](/rule/) 的看书插件, 同时也支持配置游戏规则

> 软件不提供内容, 也不提供任何规则, 但你可以通过编写 [规则](/rule/), 控制呈现内容

## 预览

### 聚合搜索

> 图片仅供参考, 内容来源自网络, 本软件不提供任何内容

![image](https://github.com/aooiuu/any-reader/assets/28108111/3c93fb87-e74d-410e-ad97-3d4a665f1c08)

### 小说

![1](https://github.com/aooiuu/any-reader-vscode/assets/28108111/fff2e255-5e09-4bff-b45c-78070dce8afc)

### 视频

> 内置视频播放暂时只支持 [vscodium](https://github.com/VSCodium/vscodium) 不支持 vscode

![1](https://github.com/aooiuu/any-reader/assets/28108111/8d622612-e95e-4f33-9981-0615348c0e6e)

### 游戏

![2](https://github.com/aooiuu/any-reader/assets/28108111/ed5544d6-ec4f-4b52-a75a-a1f618b8383d)

## 使用方式

1. 插件市场搜索 `any-reader` 安装 (安装后, `VSCode` 侧边栏会出现插件入口)
2. 点击插件侧边栏小房子图标， 或者 `F1` 输入 `>any-reader: Home`
3. 配置好源后, 侧栏列表会出现配置好的源。
4. 侧栏源列表有搜索的图标， 点击搜索图标搜索内容

## 配置规则

配置规则有两种方法

### 原始 JSON 配置

`F1` 输入 `>any-reader: 书源编辑` 会打开 `***\.any-reader\book-source.json`, 编辑后保存，刷新规则列表即可。

`book-source.json` 的文件格式：

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

为了方便， 也可以支持直接写入 `eso` 格式的规则 (也可以 `eso` 和 `json` 混用)

```json
[
  "eso://:****",
  "eso://:****",
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

### 图形界面配置

点击插件侧边栏小房子图标， 或者 `F1` 输入 `>any-reader: Home`

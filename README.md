# any-reader

[![npm version][npm-version-src]][npm-version-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![satr][satr-src]][satr-href]
[![issues][issues-src]][issues-href]

多站点自定义规则聚合阅读工具, 支持小说、漫画、视频。包含 [JS 解析库](https://aooiuu.github.io/any-reader/core/)、[VSCode 插件](https://aooiuu.github.io/any-reader/vsc/)、[桌面端](https://aooiuu.github.io/any-reader/desktop/)、[网页端](https://aooiuu.github.io/any-reader/browser/)、[Docker](https://aooiuu.github.io/any-reader/docker/)

> 软件不提供内容, 也不提供任何规则, 但你可以通过编写 [规则](https://aooiuu.github.io/any-reader/rule/), 控制呈现内容, [查看文档](https://aooiuu.github.io/any-reader/)

QQ群: 50057637

## 快速体验

```sh
npx any-reader
```

## 多端支持

### VSCode 插件

<p align="left">
  <a href="https://marketplace.visualstudio.com/items?itemName=aooiu.any-reader">
    <img
      src="https://img.shields.io/visual-studio-marketplace/v/aooiu.any-reader"
      alt=""
    />
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=aooiu.any-reader">
    <img
      src="https://img.shields.io/visual-studio-marketplace/d/aooiu.any-reader"
      alt=""
    />
  </a>
    <a href="https://marketplace.visualstudio.com/items?itemName=aooiu.any-reader">
    <img
      src="https://img.shields.io/visual-studio-marketplace/i/aooiu.any-reader"
      alt=""
    />
  </a>
</p>

[文档](https://aooiuu.github.io/any-reader/vsc/)

- [x] 本地小说阅读
  - [x] txt格式
  - [x] epub格式
  - [x] 小说章节识别
- [x] 在线小说阅读
- [x] 自定义书源规则
- [x] 自定义热键
- [x] 漫画
- [x] 聚合搜索
- [x] 发现页分类排行榜
- [x] 侧边栏阅读(可拖动到底部栏)
- [x] 收藏
- [x] 历史记录

### 桌面端

[文档](https://aooiuu.github.io/any-reader/desktop/)

|                                                  -                                                  |                                                  -                                                  |
| :-------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------: |
| ![image](https://github.com/aooiuu/any-reader/assets/28108111/bf5b9edf-8b1e-4db5-adfb-1b1300f57a4a) | ![image](https://github.com/aooiuu/any-reader/assets/28108111/3d001367-ff2d-4339-a617-0700b492f601) |
| ![image](https://github.com/aooiuu/any-reader/assets/28108111/1e8fcb4e-2ca5-49a9-ba7e-d5c7ac19856b) | ![image](https://github.com/aooiuu/any-reader/assets/28108111/a732f2ce-452e-4525-8059-7e1938fcbe01) |

### 网页端

[文档](https://aooiuu.github.io/any-reader/browser/)

 <img src="https://github.com/aooiuu/any-reader/assets/28108111/6166cc3e-f5e5-42ca-a616-5e30157f6c89" width="600"/>

快速体验:

```sh
npx any-reader
```

### Docker

快速体验：

```sh
docker build https://github.com/aooiuu/any-reader.git -t any-reader
docker run -d --name any-reader -p 8899:8899 any-reader

# 浏览器访问 http://localhost:8899/
```

### 移动端

https://github.com/mabDc/eso

## 声明

- 请大家支持正版, 所有资源来自网上, 该软件不参与任何制作, 上传, 储存等内容, 禁止传播违法资源
- 该软件仅供学习交流使用, 禁止个人用于非法商业用途, 请于安装后 24 小时内删除
- 该软件为空壳软件, 不带源, 自行研究
- 软件文档所有图片仅做为演示, 如有侵权可以提交 [issues](https://github.com/aooiuu/any-reader/issues), 我看到后会删除
- 以上部分文案来自 [ZyPlayer](https://github.com/Hiram-Wong/ZyPlayer/blob/main/README.md) 如侵权, 提 [issues](https://github.com/aooiuu/any-reader/issues), 我看到后会删除

## 感谢

- [eso](https://github.com/mabDc/eso)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=aooiuu/any-reader&type=Date)](https://star-history.com/#aoouuu/any-reade&aooiuu/any-reader&Date)

点个 `star` 可以关注更新动态, 也欢迎大家提交 `PR`.

<!-- Badges -->

[vsc-src]: https://img.shields.io/visual-studio-marketplace/v/aooiu.any-reader
[vsc-href]: https://marketplace.visualstudio.com/items?itemName=aooiu.any-reader
[npm-version-src]: https://img.shields.io/npm/v/@any-reader/core?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/@any-reader/core
[jsdocs-src]: https://img.shields.io/badge/jsDocs.io-reference-18181B?style=flat&colorA=18181B&colorB=F0DB4F
[jsdocs-href]: https://www.jsdocs.io/package/@any-reader/core
[satr-src]: https://img.shields.io/github/stars/aooiuu/any-reader
[satr-href]: https://github.com/aooiuu/any-reader
[issues-src]: https://img.shields.io/github/issues/aooiuu/any-reader
[issues-href]: https://github.com/aooiuu/any-reader

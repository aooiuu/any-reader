# any-reader

[![npm version][npm-version-src]][npm-version-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![satr][satr-src]][satr-href]
[![issues][issues-src]][issues-href]

多站点自定义规则聚合阅读工具, 支持小说、漫画、视频。包含 [规则解析库](https://aooiuu.github.io/any-reader/core/)、[VSCode 插件](https://aooiuu.github.io/any-reader/vsc/)、[桌面端](https://aooiuu.github.io/any-reader/desktop/)、[网页端](https://aooiuu.github.io/any-reader/browser/)、[Docker](https://aooiuu.github.io/any-reader/docker/)

> 软件不提供内容, 也不提供任何规则, 但你可以通过编写 [规则](https://aooiuu.github.io/any-reader/rule/), 控制呈现内容, [查看文档](https://aooiuu.github.io/any-reader/)

QQ群: 50057637

<details>
<summary>展开查看软件是如何工作的</summary>

通过编写规则, 把不同的来源的数据以相同的格式呈现, 以达到聚合搜索、查看的的目的。

类似 RSSHub 把数据输出为标准的 RSS 格式, AnyReader 通过编写规则把格式输出为 章节列表、内容、搜索、分类等统一格式

规则由 XPath、JSONPath、CSS选择器、正则、JS脚本等组合而成。

XPath、JSONPath、CSS选择器、正则让规则编写更简洁, 而 JS 脚本让规则编写更自由。

内容类型目前分为小说、漫画、视频、音频、RSS、游戏。根据不同的内容类型呈现不同的查看页面。

注意: 软件仅供个人学习交流之用，24小时内请自觉卸载，勿作商业用途。软件不提供内容, 也不提供任何规则。

</details>

<details>
<summary>展开查看用户协议及免责申明</summary>

1. 若您不同意本声明的任何内容，请您立即停止使用本软件。一旦您开始使用本软件产品和服务，则表示您已同意本声明的所有内容。
2. 本软件仅供个人学习、研究和技术交流使用，仅提供展示功能，所有数据资源均由用户自身制作提供，包括但不限于小说、漫画、视频网站、媒体分享站点等。本软件无法控制这些资源的合法性、准确性、完整性或可用性，因此不对资源内容的真实性、合法性或适用性负责。
3. 由于数据源为用户自行制作，我们在此特别提醒, 视频或弹幕中可能出现的任何第三方广告、产品推广信息等相关内容，均系第三方(含用户)行为植入，非本软件策划或添加。请您在体验过程中保持警惕，对这类信息的真实性及合法性进行自主甄别，如用户遇诈骗因此产生的损失，本平台不承担任何责任。
4. 本软件仅使用Iframe嵌入多家视频平台网站内容, 对于用户在使用本软件过程中对如上网站进行的任何操作，本软件不承担任何责任。
5. 为遵守网络安全法的内容审核要求，本软件不提供弹幕发送服务。关于弹幕展示，受限于本地性能未做数据清理，可能存在不良言论，请勿相信因此引起非必的要麻烦。同时如果用户通过任何渠道发表不良言论行为，该行为与本软件无关。我们呼吁用户文明用语，共同维护网络健康环境。
6. 您在使用本软件时需自行负责所有操作和使用结果。本软件不对您通过使用本软件获取的任何内容负责，包括但不限于媒体资源的准确性、版权合规性、完整性、安全性和可用性。对于任何因使用本软件导致的损失、损害或法律纠纷，不承担任何责任。
7. 您在使用本软件时必须遵守您所在国家/地区的相关法律法规，禁止使用本软件进行任何违反法律法规的活动，包括但不限于制作、上传、传播、存储任何违法、侵权、淫秽、诽谤、恶意软件等内容。如您违反相关法律法规，需自行承担法律责任。
8. 本免责声明适用于本软件的所有用户。本软件保留随时修改、更新本声明的权利，并以Github Readme、软件更新等形式通知用户。请您定期查阅并遵守最新的免责声明。

</details>

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

<details>
<summary>功能清单</summary>

- [x] 本地小说阅读
  - [x] txt格式
  - [x] epub格式
  - [x] 小说章节识别
- [x] 在线小说阅读
- [x] 自定义书源规则
- [x] 自定义热键
- [x] 漫画
- [x] 游戏
- [x] 聚合搜索
- [x] 发现页分类排行榜
- [x] 侧边栏阅读(可拖动到底部)
- [x] 收藏
- [x] 历史记录
- [x] 支持编辑器直接打开 epub 文件

</details>

### 桌面端

[文档](https://aooiuu.github.io/any-reader/desktop/)

<details>
<summary>功能清单</summary>

- [x] 本地小说阅读
  - [x] txt格式
  - [x] epub格式
  - [x] 小说章节识别
- [x] 在线小说阅读
- [x] 自定义书源规则
- [x] 自定义热键
- [x] 漫画
- [x] 视频
- [ ] 视频下载 (🚧开发中)
- [x] 聚合搜索
- [x] 发现页分类排行榜
- [x] 收藏
- [x] 历史记录

</details>

|                                                  -                                                  |                                                  -                                                  |
| :-------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------: |
| ![image](https://github.com/aooiuu/any-reader/assets/28108111/bf5b9edf-8b1e-4db5-adfb-1b1300f57a4a) | ![image](https://github.com/aooiuu/any-reader/assets/28108111/3d001367-ff2d-4339-a617-0700b492f601) |
| ![image](https://github.com/aooiuu/any-reader/assets/28108111/1e8fcb4e-2ca5-49a9-ba7e-d5c7ac19856b) | ![image](https://github.com/aooiuu/any-reader/assets/28108111/a732f2ce-452e-4525-8059-7e1938fcbe01) |

### 网页端

> 网页端功能基本和桌面端一致

[文档](https://aooiuu.github.io/any-reader/browser/)

 <img src="https://github.com/aooiuu/any-reader/assets/28108111/6166cc3e-f5e5-42ca-a616-5e30157f6c89" width="600"/>


```sh
# 克隆项目
git clone git@github.com:aooiuu/any-reader.git

# 进入项目根目录
cd any-reader

# 安装依赖
pnpm i

# 编译 解析库、工具库
pnpm run build

pnpm run web:dev
```

### Docker

![Docker Image Version](https://img.shields.io/docker/v/aooiu/any-reader)

快速体验：

```sh
docker build https://github.com/aooiuu/any-reader.git -t any-reader
docker run -d --name any-reader -p 8899:8899 any-reader

# 浏览器访问 http://localhost:8899/
```

如果构建失败, 可以使用 DockerHub 的镜像:

```sh
docker run -d --name any-reader -p 8899:8899 aooiu/any-reader
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

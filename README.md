# any-reader

[![npm version][npm-version-src]][npm-version-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![satr][satr-src]][satr-href]
[![issues][issues-src]][issues-href]

## 目录

- [软件介绍](#软件介绍)
- [功能亮点](#功能亮点)
- [界面预览](#界面预览)
- [完整文档](https://aooiuu.github.io/any-reader/)
- [声明](#声明)

## 软件介绍

开源的多平台自定义源资源聚合工具。支持小说、漫画阅读、视频播放、聚合搜索、发现分类等, 也支持本地资源TXT、EPUB

**QQ群**: 50057637
**注意**: 软件不提供内容, 也不提供任何规则, 但你可以通过编写 [规则](https://aooiuu.github.io/any-reader/rule/), 控制呈现内容, [查看文档](https://aooiuu.github.io/any-reader/)

**⚠️注意**: 在运行不受信任规则时有安全性风险!因为规则可以利用JS越权！请慎重使用未知的规则！

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

## 功能亮点

- **跨平台**: Windows、Mac、Linux
- **多应用**: 桌面端、网页端、Docker、VSCode插件
- **多类型**：小说、漫画、视频、~~音频~~
- **自定义源**：通过 XPath、JSONPath、CSS选择器、正则、JS等轻松编写[规则](https://aooiuu.github.io/any-reader/rule/)
- **生态兼容**：兼容 [eso](https://github.com/mabDc/eso) 源
- **资源站接入**：支持导入苹果CMS、ZyPlayer
- **开放解析库**：[规则解析库](https://aooiuu.github.io/any-reader/core/)分离, 你可以使用解析库开发自己的程序
- **本地资源支持**：支持本地小说格式 TXT、Epub

## 界面预览

### 桌面端

[![release](https://img.shields.io/github/downloads/aooiuu/any-reader/total)](https://github.com/aooiuu/any-reader/releases)

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
- [x] 聚合搜索
- [x] 发现页分类排行榜
- [x] 收藏
- [x] 历史记录
- [x] 小说朗读
- [x] 阅读进度保存
- [x] 在线小说缓存

</details>

|                                              漫画                                               |                                              小说                                               |                                              视频                                               |
| :---------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------: |
| ![1](https://github.com/aooiuu/any-reader/assets/28108111/60098f86-222e-471f-a542-52e10394192c) | ![2](https://github.com/aooiuu/any-reader/assets/28108111/1b4f9c60-cada-432b-9a1d-f7d80bffa570) | ![3](https://github.com/aooiuu/any-reader/assets/28108111/ecd65276-ed1c-4577-b066-d788a322d1f4) |
| ![4](https://github.com/aooiuu/any-reader/assets/28108111/e0a9ec10-e72e-49ed-8610-588f0af17a55) | ![5](https://github.com/aooiuu/any-reader/assets/28108111/997582a4-b69a-4bd9-8cc0-1b661688de4f) | ![6](https://github.com/aooiuu/any-reader/assets/28108111/afebc6dd-16d5-4521-9b9f-72432ad9cb13) |
|                                            聚合搜索                                             |                                            规则列表                                             |                                            规则编辑                                             |
| ![7](https://github.com/aooiuu/any-reader/assets/28108111/aa66ad97-2ce4-4533-b4b5-c4d9c36dccbb) | ![8](https://github.com/aooiuu/any-reader/assets/28108111/11f011e3-af9e-4921-9459-11094e8554c3) | ![9](https://github.com/aooiuu/any-reader/assets/28108111/dc53bb59-9d72-4594-8d3f-2dea5f208998) |

> 图片仅供参考, 内容来源自网络, 本软件不提供任何内容

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
- [x] 侧边栏阅读
- [x] 收藏
- [x] 历史记录
- [x] 支持编辑器直接打开 epub 文件
- [x] 小说朗读
- [x] 阅读进度保存
- [x] 在线小说缓存

</details>

<details>
<summary>预览</summary>

|                                                搜索                                                 |                                              章节列表                                               |
| :-------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------: |
| ![image](https://github.com/aooiuu/any-reader/assets/28108111/f134196b-2943-4d91-937c-159940a44014) | ![image](https://github.com/aooiuu/any-reader/assets/28108111/ec23778a-d024-44a3-acfc-5d073aea3e8f) |
|                                              文字阅读                                               |                                              漫画阅读                                               |
| ![image](https://github.com/aooiuu/any-reader/assets/28108111/f331f5c9-3865-4bb2-a6e2-4c98ff0794ae) | ![image](https://github.com/aooiuu/any-reader/assets/28108111/41c0b214-c066-4b30-a3c4-02e4ab073440) |
|                                                设置                                                 |                                                                                                     |
| ![image](https://github.com/aooiuu/any-reader/assets/28108111/ad15fc5b-1d74-4298-a137-5c615fe6cbe8) |                                                                                                     |

</details>

### 网页端

> 网页端功能基本和桌面端一致

[文档](https://aooiuu.github.io/any-reader/browser/)

 <img src="https://github.com/user-attachments/assets/c0f073fa-0f97-48ce-a6dd-ed352e46c4b0" width="400"/>

```sh
# 快速体验网页版, node >= 20
# 建议从源码构建

npm install -g any-reader@latest
any-reader web -p 9999
```

### Docker

[![docker version](https://img.shields.io/docker/v/aooiu/any-reader)](https://hub.docker.com/r/aooiu/any-reader)
[![docker publish](https://img.shields.io/docker/pulls/aooiu/any-reader?label=docker%20pulls&logo=docker&style=flat-square)](https://hub.docker.com/r/aooiu/any-reader)

[文档](https://aooiuu.github.io/any-reader/docker/)

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

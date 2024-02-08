# any-reader

[![npm version][npm-version-src]][npm-version-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]

## 特性

- 多站点自定义规则聚合阅读
- 支持小说、漫画、~~视频、RSS.~~
- 规则解析库分离, 可独立安装。

## 文档

- [core](./packages/core/README.md)
- [any-reader-vscode](./packages/vscode/README.md)
- [any-reader-web](./packages/web/README.md)

## 预览

![1](https://github.com/aooiuu/any-reader-vscode/assets/28108111/fff2e255-5e09-4bff-b45c-78070dce8afc)

## 目录结构

```
├── docs
├── packages
|  ├── core         规则解析库
|  ├── vscode       vscode 扩展
|  └── web          目前用于 vscode 扩展的 Web 相关页面
├── README.md
└── scripts
```

## 参与开发

```sh
# 克隆项目
git clone git@github.com:aooiuu/any-reader.git

# 进入项目根目录
cd any-reader

# 安装依赖
pnpm i

# 编译 core
pnpm run build:core
```

如果需要调试 `VSCode` 插件, 用 `VSCode` 打开 `/packages/vscode` 目录, `F5` 即可运行调试插件!

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@any-reader/core?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/@any-reader/core
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@any-reader/core?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=@any-reader/core
[jsdocs-src]: https://img.shields.io/badge/jsDocs.io-reference-18181B?style=flat&colorA=18181B&colorB=F0DB4F
[jsdocs-href]: https://www.jsdocs.io/package/@any-reader/core

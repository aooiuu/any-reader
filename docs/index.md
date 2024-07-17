---
outline: deep
---

# any-reader

开源的多平台自定义源资源聚合工具。支持小说、漫画阅读、视频播放、聚合搜索等, 也支持本地资源TXT、EPUB

- [JS 解析库](./core/)
- [VSCode 插件](./vsc/)
- [桌面端](./desktop/)
- [网页端](./browser/)
- [Docker](./docker/)
- uTools 插件

软件不提供内容, 也不提供任何规则, 但你可以通过编写 [规则](./rule/), 控制呈现内容

## 参与开发

### VSCode

```sh
# 克隆项目
git clone git@github.com:aooiuu/any-reader.git

# 进入项目根目录
cd any-reader

# 启用 Corepack
corepack enable

# 安装依赖
pnpm i

# 编译 解析库、工具库、前端模板
pnpm run build
```

用 `VSCode` 打开 `/packages/vscode` 目录, `F5` 即可运行调试插件!

### Core

调试：

1. 修改 `src\start.ts` 文件, 把 `rule` 变量修改为真实的书源
2. 进入目录 `cd packages\core`
3. vscode 打开调试终端, 输入 `pnpm run start`

### 前端模板

```sh
# 进入目录
cd packages\web

# 实时编译到 VSCode 目录
pnpm run build:w
```

### 源码目录结构

```
├── docs
├── packages
|  ├── core         规则解析库
|  ├── vscode       vscode 扩展
|  └── web          目前用于 vscode 扩展的 Web 相关页面
├── README.md
└── scripts
```

## 常见问题

### 搜索失败

如果您是从网络上找到的源，那么可能是源过期了，也可能是规则部分没有支持。

如果使用 `eso` 可以搜索， 那说明没过期。请提交 [issues](https://github.com/aooiuu/any-reader/issues)

### 导入 ZyPlayer 源

`AnyReader` 会从 `tbl_site` 列表转换为可以使用的规则。

`ZyPlayer` 配置一般长这样:

```json
{
  "tbl_site": [
    {
      "key": "xxx",
      "name": "xxx",
      "api": "xxx",
      "playUrl": "",
      "search": 1,
      "group": "xxx",
      "status": false,
      "type": 1,
      "id": "1",
      "isActive": true
    }
  ],
  // ...
}
```

> 转换后的规则不但 `AnyReader`  可以使用, `ESO` 一样可以使用哦


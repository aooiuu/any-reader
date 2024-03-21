---
outline: deep
---

# any-reader

多站点自定义规则聚合阅读工具, 支持小说、漫画。包含 [JS 解析库](./core/) 和 [VSCode 插件](./vsc/)

软件不提供内容, 也不提供任何规则, 但你可以通过编写 [规则](./rule/), 控制呈现内容

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
# 实时编译 web 模板 到 vscode
pnpm run build:web-w
```

如果需要调试 `VSCode` 插件, 用 `VSCode` 打开 `/packages/vscode` 目录, `F5` 即可运行调试插件!
如果需要调试 `Core` , 参考 [开发和调试](/core/#开发和调试)

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

如果使用 `eso` 可以搜索， 那说明没过期。您可以检查规则是否有不支持的部分。

[查看规则支持情况](/core/#规则支持情况). 如果规则支持情况说明里写了支持或部分支持，那请提交 [issues](https://github.com/aooiuu/any-reader/issues)

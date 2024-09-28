---
outline: deep
---

# any-reader

## 参与开发

```sh
# 克隆项目
git clone git@github.com:aooiuu/any-reader.git

# 进入项目根目录
cd any-reader

# 启用 Corepack
corepack enable

# 安装依赖
pnpm i

# 运行网页版
pnpm run web:dev
```

### 源码目录结构

```
├── docs
├── packages
|  ├── cli                命令行工具
|  ├── core               规则解析库
|  ├── legado             阅读3规则解析库(开发中)
|  ├── rule-utils         规则转换
|  ├── epub               epub解析
|  ├── shared             多端通用逻辑
|  ├── vscode             vscode插件
|  ├── utools             utools插件
|  ├── rubick             rubick插件
|  ├── server             web端需要的服务端
|  └── web                模板
├── README.md
└── scripts
```

## 常见问题

### 无法使用搜索功能

需要配置规则

### 搜索失败

如果您是从网络上找到的源，那么可能是源过期了，也可能是规则部分没有支持。

如果使用 `eso` 可以搜索， 那说明没过期。请提交 [issues](https://github.com/aooiuu/any-reader/issues)

### 本地书籍怎么导入

`设置` -> `本地书籍目录` 填写本地目录

软件会自动加载目录下的 `.txt` 和 `.epub` 文件

### 数据文件在哪

windows: `C:\Users\%USERNAME%\.any-reader\`

对应的源码: `path.join(os.homedir(), '.any-reader')`

### 导入 ZyPlayer 源

`any-reader` 会从 `tbl_site` 列表转换为可以使用的规则。 目前仅支持 `type=0` 或者 `type=1` 的源

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
  ]
  // ...
}
```

> 转换后的规则不但 `any-reader` 可以使用, `ESO` 一样可以使用哦

### 朗读功能怎么用

`设置` -> `热键` -> `朗读`

设置热键后, 阅读页面按热键既可, 朗读状态下再按一次暂停。

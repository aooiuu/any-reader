---
outline: deep
---

# CLI

> 命令行工具

```sh
# 安装
npm install -g any-reader@latest

# 使用
any-reader [commands]
```

## 命令

```
Commands:
  web [options]         启用一个 WEB 服务
  rule-encode <string>  规则编码
  rule-decode <string>  规则解码
  check [options]       规则校验
  help [command]
```

### web

```sh
any-reader web -p 8899
```

```
Options:
  -p, --port <string>  端口 (default: "8898")
```

### check

```sh
any-reader check -i "xxx.json" -o "xxx.json"
```

```
Options:
  -i, --input <string>        规则文件路径(json)
  -o, --output <string>       输出规则文件路径(json)
  -c, --concurrency <number>  任务并发数 (default: "10")
```

### rule-encode

```sh
# any-reader rule-encode [规则json]
any-reader rule-encode "{}"
```

### rule-decode

```sh
# any-reader rule-decode [编码后的规则]
any-reader rule-decode "eso://xxxx"
```

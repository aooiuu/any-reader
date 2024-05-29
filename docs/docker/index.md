---
outline: deep
---

# Docker

快速体验：

```sh
docker build https://github.com/aooiuu/any-reader.git -t any-reader
docker run -d --name any-reader -p 8899:8899 any-reader

# 浏览器访问 http://localhost:8899/
```
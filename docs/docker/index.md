---
outline: deep
---

# Docker

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

## 持久化数据

加上 `-v any-reader:/root/.any-reader`

比如:

```sh
docker run -d --name any-reader -p 9900:8899 -v any-reader:/root/.any-reader aooiu/any-reader
```

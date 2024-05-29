# syntax=docker/dockerfile:1.7-labs
FROM node:20-bookworm AS dep-builder

WORKDIR /app

RUN corepack enable pnpm

RUN \
  echo 'use npm mirror' && \
  npm config set registry https://registry.npmmirror.com && \
  yarn config set registry https://registry.npmmirror.com && \
  pnpm config set registry https://registry.npmmirror.com ;


COPY ./pnpm-lock.yaml /app/
COPY ./pnpm-workspace.yaml /app/
COPY ./package.json /app/
COPY --parents packages/*/package.json /app/

RUN pnpm install

COPY . /app
RUN pnpm build:core && pnpm build:shared

EXPOSE 8899
CMD ["pnpm", "web:dev"]

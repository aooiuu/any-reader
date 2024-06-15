FROM node:20-alpine AS dep-builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@8.6.5 --activate

RUN \
  echo 'use npm mirror' && \
  npm config set registry https://registry.npmmirror.com && \
  yarn config set registry https://registry.npmmirror.com && \
  pnpm config set registry https://registry.npmmirror.com ;

COPY ["./pnpm-lock.yaml", ".npmrc",  "./pnpm-workspace.yaml", "./package.json",  "/app/"]

RUN pnpm fetch

COPY . /app
RUN pnpm install -r --offline

RUN pnpm run build && pnpm run web:build-b

EXPOSE 8899
CMD ["pnpm", "run", "server"]

FROM node:20-bookworm-slim AS dep-builder

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


# puppeteer
RUN apt-get update \
  && apt-get install -y \
  ca-certificates \
  fonts-freefont-ttf \
  fonts-ipafont-gothic \
  fonts-kacst \
  fonts-liberation \
  fonts-thai-tlwg \
  fonts-wqy-zenhei \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libgcc1 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  wget \
  xdg-utils \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

RUN pnpm run build && pnpm run web:build-b

EXPOSE 8899
CMD ["pnpm", "run", "server"]

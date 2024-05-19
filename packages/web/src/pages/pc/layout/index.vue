<template>
  <div class="w-full h-full flex flex-col overflow-hidden">
    <div
      class="text-12 flex justify-center items-center h-34 lh-34 bg-[--titleBar-inactiveBackground] border-b-1 border-b-solid border-b-[--titleBar-border-bottom] pr-2"
      style="-webkit-app-region: drag"
    >
      <div class="w-20%" />
      <div class="flex gap-4 items-center justify-center flex-1 w-60% text-[--titleBar-inactiveForeground]">
        <span class="w-22 codicon codicon-arrow-left cursor-pointer hover:op-70 app-region-none" @click="router.back"></span>
        <span class="w-22 codicon codicon-arrow-right cursor-pointer hover:op-70 app-region-none" @click="router.forward"></span>
        <div
          class="box-content flex items-center justify-center ml-6 w-38vw max-w-600 bg-[--commandCenter-background] border-1 border-solid rounded-6 h-22 border-[--commandCenter-inactiveBorder] cursor-pointer hover:bg-[--commandCenter-activeBackground] app-region-none"
        >
          开发中
        </div>
      </div>
      <div class="w-20% h-full flex gap-4 items-center justify-end text-[--titleBar-inactiveForeground]">
        <template v-if="PLATFORM === 'electron'">
          <div
            class="w-40 h-full flex justify-center items-center cursor-pointer hover:bg-[--toolbar-hoverBackground] app-region-none"
            @click="minimize"
          >
            <span class="codicon codicon-chrome-minimize"></span>
          </div>
          <div
            class="w-40 h-full flex justify-center items-center cursor-pointer hover:bg-[--toolbar-hoverBackground] fullscreen app-region-none"
            @click="maximize"
          >
            <span class="codicon codicon-chrome-maximize"></span>
          </div>
          <div class="w-40 h-full flex justify-center items-center cursor-pointer hover:bg-[--toolbar-hoverBackground] app-region-none" @click="exit">
            <span class="codicon codicon-chrome-close"></span>
          </div>
        </template>
      </div>
    </div>
    <div class="flex flex-1 overflow-auto">
      <!-- 侧边栏 -->
      <div
        class="w-48 flex flex-col py-10 text-[--foreground] bg-[--activityBar-background] text-24 border-r-1 border-r-solid border-r-[--titleBar-border-bottom]"
      >
        <!-- 收藏 -->
        <div
          v-for="nav in navs"
          :key="nav.path"
          :class="[
            'w-42 h-42 flex items-center justify-center hover:text-[--activityBar-foreground] cursor-pointer',
            route.path === nav.path ? 'text-[--activityBar-foreground]' : ''
          ]"
          @click="router.push(nav.path)"
        >
          <span :class="['codicon !text-24px', nav.icon]"></span>
        </div>
        <div class="flex-1"></div>

        <div :class="['w-42 h-42 flex items-center justify-center hover:text-[--activityBar-foreground] cursor-pointer']" @click="openSetting">
          <span :class="['codicon !text-24px codicon-settings-gear']"></span>
        </div>
      </div>
      <div class="flex-1 overflow-hidden bg-[--main-background]">
        <RouterView v-slot="{ Component, route: _route }">
          <KeepAlive>
            <component :is="Component" v-if="_route.meta.keepAlive" :key="_route.fullPath" />
          </KeepAlive>
          <component :is="Component" v-if="!_route.meta.keepAlive" :key="_route.fullPath" />
        </RouterView>
      </div>
    </div>
  </div>
</template>

<script setup lang="jsx">
import { Modal } from '@arco-design/web-vue';
import { PLATFORM } from '@/constants';
import { minimize, maximize, exit } from '@/api/electron';
import Setting from '@/components/Setting/index.vue';

const route = useRoute();
const router = useRouter();

const navs = [
  { icon: 'codicon-book', path: '/pc/books', title: '书架' },
  { icon: 'codicon-search', path: '/pc/search', title: '搜索' },
  { icon: 'codicon-flame', path: '/pc/category', title: '分类' },
  { icon: 'codicon-surround-with', path: '/pc/rules', title: '规则' }
];

function openSetting() {
  Modal.open({
    draggable: true,
    width: 600,
    footer: false,
    title: '设置',
    bodyClass: '!p-0',
    content: <Setting />
  });
}
</script>

<style lang="scss">
body {
  --titleBar-inactiveBackground: rgb(31, 31, 31);
  --titleBar-inactiveForeground: rgba(204, 204, 204, 0.6);
  --titleBar-border-bottom: rgb(43, 43, 43);
  /* --toolbar-activeBackground: rgba(90, 93, 94, 0.31); */
  --toolbar-hoverBackground: rgba(90, 93, 94, 0.31);
  --commandCenter-background: rgba(255, 255, 255, 0.05);
  --commandCenter-inactiveBorder: rgba(204, 204, 204, 0.15);
  --commandCenter-activeBackground: rgba(255, 255, 255, 0.08);
  --foreground: rgb(134, 134, 134);
  --activityBar-foreground: rgb(215, 215, 215);
  --activityBar-background: rgb(24, 24, 24);
  --main-background: rgb(31, 31, 31);
  --scrollbarSlider-background: rgba(121, 121, 121, 0.4);
  --editor-background: #1f1f1f;

  scrollbar-color: var(--scrollbarSlider-background) var(--editor-background);

  --color-bg-3: rgb(24, 24, 24);

  &[arco-theme='dark'] {
    --color-bg-3: rgb(24, 24, 24);
  }
}

.app-region-none {
  -webkit-app-region: none;

  * {
    -webkit-app-region: none;
  }
}
</style>

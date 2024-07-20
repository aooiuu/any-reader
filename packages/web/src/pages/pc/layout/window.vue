<template>
  <BaseLayout>
    <div class="w-full h-full flex flex-col overflow-hidden">
      <div
        class="app-region-drag hidden sm:flex text-12 justify-center items-center h-34 lh-34 border-b-1 border-b-solid border-b-[--ar-top-bar-border-bottom] pr-2 bg-[--ar-top-bar-bg] text-[--ar-top-bar-text]"
      >
        <div class="topbar__left w-20%" />
        <div class="w-60% flex gap-4 items-center justify-center flex-1 text-[--ar-color-text]"></div>
        <div class="w-20% h-full flex gap-4 items-center justify-end text-[--ar-color-text]">
          <template v-if="PLATFORM === 'electron'">
            <!-- 布局 -->
            <div class="w-40 h-full flex justify-center items-center cursor-pointer hover:bg-[--ar-top-bar-hover-background] app-region-none">
              <span :class="['codicon', pinned ? 'codicon-pinned-dirty' : 'codicon-pinned']" @click="changePinned" />
            </div>
            <!-- 窗口 -->
            <div
              class="w-40 h-full flex justify-center items-center cursor-pointer hover:bg-[--ar-top-bar-hover-background] app-region-none"
              @click="minimize"
            >
              <span class="codicon codicon-chrome-minimize" />
            </div>
            <div
              class="w-40 h-full flex justify-center items-center cursor-pointer hover:bg-[--ar-top-bar-hover-background] fullscreen app-region-none"
              @click="maximize"
            >
              <span class="codicon codicon-chrome-maximize"></span>
            </div>
            <div
              class="w-40 h-full flex justify-center items-center cursor-pointer hover:bg-[--ar-top-bar-hover-background] app-region-none"
              @click="exit"
            >
              <span class="codicon codicon-chrome-close"></span>
            </div>
          </template>
        </div>
      </div>
      <div class="flex flex-1 overflow-auto">
        <RouterView v-slot="{ Component, route: _route }">
          <KeepAlive>
            <component :is="Component" v-if="_route.meta.keepAlive" :key="_route.path" />
          </KeepAlive>
          <component :is="Component" v-if="!_route.meta.keepAlive" :key="_route.path" />
        </RouterView>
      </div>
    </div>
    <Search />
  </BaseLayout>
</template>

<script setup lang="jsx">
import { PLATFORM } from '@/constants';
import { minimize, maximize, exit, alwaysOnTop } from '@/api/modules/electron';
import Search from '@/components/Search/index.vue';
import BaseLayout from './BaseLayout.vue';

const pinned = ref(false);

async function changePinned() {
  const res = await alwaysOnTop(!pinned.value).catch(() => {});
  if (res?.code === 0) {
    pinned.value = res.data;
  }
}
</script>

<template>
  <BaseLayout>
    <div class="h-full w-full flex flex-col overflow-hidden">
      <div
        class="app-region-drag hidden h-34 items-center justify-center border-b-1 border-b-[--ar-top-bar-border-bottom] border-b-solid bg-[--ar-top-bar-bg] pr-2 text-12 text-[--ar-top-bar-text] lh-34 sm:flex"
      >
        <div class="topbar__left w-20%" />
        <div class="w-60% flex flex-1 items-center justify-center gap-4 text-[--ar-color-text]"></div>
        <div class="h-full w-20% flex items-center justify-end gap-4 text-[--ar-color-text]">
          <template v-if="PLATFORM === 'electron'">
            <!-- 布局 -->
            <div class="app-region-none h-full w-40 flex cursor-pointer items-center justify-center hover:bg-[--ar-top-bar-hover-background]">
              <span :class="['codicon', pinned ? 'codicon-pinned-dirty' : 'codicon-pinned']" @click="changePinned" />
            </div>
            <!-- 窗口 -->
            <div
              class="app-region-none h-full w-40 flex cursor-pointer items-center justify-center hover:bg-[--ar-top-bar-hover-background]"
              @click="minimize"
            >
              <span class="codicon codicon-chrome-minimize" />
            </div>
            <div
              class="fullscreen app-region-none h-full w-40 flex cursor-pointer items-center justify-center hover:bg-[--ar-top-bar-hover-background]"
              @click="maximize"
            >
              <span class="codicon codicon-chrome-maximize"></span>
            </div>
            <div
              class="app-region-none h-full w-40 flex cursor-pointer items-center justify-center hover:bg-[--ar-top-bar-hover-background]"
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

<template>
  <div class="h-full w-full flex flex-col text-[--foreground]">
    <div class="flex-1 overflow-auto">
      <RouterView v-slot="{ Component, route: routev }">
        <KeepAlive :max="5">
          <component :is="Component" v-if="routev.meta.keepAlive" :key="routev.fullPath" />
        </KeepAlive>
        <component :is="Component" v-if="!routev.meta.keepAlive" :key="routev.fullPath" />
      </RouterView>
    </div>
    <div v-if="!hideBtmBar" class="flex items-center gap-4 px-8 py-4">
      <div class="codicon codicon-arrow-left vsc-toolbar-btn" @click="router.back()"></div>
      <div v-if="settingStore.timeIsShow">已摸鱼：{{ showTIme }}</div>
      <div class="flex-1"></div>
      <div
        class="codicon codicon-github-alt vsc-toolbar-btn"
        title="github"
        @click="executeCommand({ command: 'vscode.open', data: ['https://github.com/aooiuu/any-reader'] })"
      ></div>
      <div class="codicon codicon-settings-gear vsc-toolbar-btn" title="设置" @click="router.push('/settings')"></div>
      <div class="codicon codicon-extensions vsc-toolbar-btn" title="规则" @click="router.push('/vsc/rules')"></div>
      <div class="codicon codicon-flame vsc-toolbar-btn" title="大发现页" @click="executeCommand({ command: 'any-reader.discover' })"></div>
      <div class="codicon codicon-go-to-search vsc-toolbar-btn" title="大搜索" @click="executeCommand({ command: 'any-reader.search' })"></div>
      <div class="codicon codicon-search vsc-toolbar-btn" title="搜索" @click="router.push('/vsc/search')"></div>
      <div class="codicon codicon-home vsc-toolbar-btn" title="首页" @click="router.push('/')"></div>
    </div>
  </div>
</template>

<script setup>
// import '@/assets/vscode.css';
import '@/plugins/vsc-ui';

import { executeCommand } from '@/api/modules/vsc';
import { useSettingStore } from '@/stores/setting';

const route = useRoute();
const router = useRouter();
const settingStore = useSettingStore();

const hideBtmBar = computed(() => route.meta?.hideBtmBar);

console.log('settingStore.readTime:', settingStore.readTime);
const showTIme = computed(() => {
  const readTime = settingStore.readTime;

  if (readTime <= 0) return 0;
  const hours = Math.floor(readTime / 3600);
  const minutes = Math.floor((readTime % 3600) / 60);
  const seconds = readTime % 60;
  return `${hours}:${minutes}:${seconds}`;
});
</script>

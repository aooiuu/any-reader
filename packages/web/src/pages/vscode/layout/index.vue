<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex-1 overflow-auto">
      <RouterView v-slot="{ Component, route: routev }">
        <KeepAlive>
          <component :is="Component" v-if="routev.meta.keepAlive" :key="routev.fullPath" />
        </KeepAlive>
        <component :is="Component" v-if="!routev.meta.keepAlive" :key="routev.fullPath" />
      </RouterView>
    </div>
    <div v-if="!hideBtmBar" class="flex py-4 px-8 gap-4">
      <div class="vsc-toolbar-btn codicon codicon-arrow-left" @click="router.back()"></div>
      <div class="flex-1"></div>
      <div
        class="vsc-toolbar-btn codicon codicon-github-alt"
        title="github"
        @click="executeCommand({ command: 'vscode.open', data: ['https://github.com/aooiuu/any-reader'] })"
      ></div>
      <div class="vsc-toolbar-btn codicon codicon-settings-gear" title="设置" @click="router.push('/settings')"></div>
      <div class="vsc-toolbar-btn codicon codicon-extensions" title="规则" @click="router.push('/vsc/rules')"></div>
      <div class="vsc-toolbar-btn codicon codicon-flame" title="大发现页" @click="executeCommand({ command: 'any-reader.discover' })"></div>
      <div class="vsc-toolbar-btn codicon codicon-go-to-search" title="大搜索" @click="executeCommand({ command: 'any-reader.search' })"></div>
      <div class="vsc-toolbar-btn codicon codicon-search" title="搜索" @click="router.push('/vsc/search')"></div>
      <div class="vsc-toolbar-btn codicon codicon-home" title="首页" @click="router.push('/')"></div>
    </div>
  </div>
</template>

<script setup>
import '@/assets/vscode.css';
import '@/plugins/vsc-ui';

import { executeCommand } from '@/api/vsc';

const route = useRoute();
const router = useRouter();

const hideBtmBar = computed(() => route.meta?.hideBtmBar);
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div class="flex-1 overflow-auto">
      <RouterView v-slot="{ Component, route }">
        <KeepAlive>
          <component :is="Component" v-if="route.meta.keepAlive" :key="route.fullPath" />
        </KeepAlive>
        <component :is="Component" v-if="!route.meta.keepAlive" :key="route.fullPath" />
      </RouterView>
    </div>

    <div v-if="PLATFORM === 'vscode'" class="flex py-4 px-8 gap-4">
      <div class="vsc-toolbar-btn codicon codicon-arrow-left" @click="router.back()"></div>
      <div class="flex-1"></div>
      <div class="vsc-toolbar-btn codicon codicon-github-alt" title="github" @click="github()"></div>
      <div class="vsc-toolbar-btn codicon codicon-settings-gear" title="设置" @click="router.push('/settings')"></div>
      <!-- 分类 -->
      <!-- <div class="vsc-toolbar-btn codicon codicon-symbol-structure" @click="discover()"></div> -->
      <!-- 规则 -->
      <div class="vsc-toolbar-btn codicon codicon-symbol-namespace" title="规则列表" @click="router.push('/vsc/rules')"></div>
      <div class="vsc-toolbar-btn codicon codicon-surround-with" title="编辑规则" @click="editBookSource()"></div>
      <div class="vsc-toolbar-btn codicon codicon-search" title="搜索" @click="router.push('/vsc/search')"></div>
      <div class="vsc-toolbar-btn codicon codicon-home" title="首页" @click="router.push('/')"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { PLATFORM } from '@/constants';
import { useMessage } from '@/utils/postMessage';
import { editBookSource, github } from '@/api/vsc';

const router = useRouter();

document.body.setAttribute('arco-theme', 'dark');

useMessage('router.push', (data: string) => {
  router.push(data);
});
</script>

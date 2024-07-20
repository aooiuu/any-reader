<template>
  <div class="w-full h-full flex flex-col overflow-hidden relative">
    <div v-if="loading" class="flex flex-1 justify-center items-center">
      <vscode-progress-ring></vscode-progress-ring>
    </div>
    <div
      ref="contentRef"
      class="flex-1 p-10 whitespace-pre-wrap overflow-y-auto lh-1.5em break-words indent-2em"
      :style="{
        fontSize: settingStore.data.readStyle.fontSize + 'px',
        lineHeight: settingStore.data.readStyle.lineHeight,
        letterSpacing: settingStore.data.readStyle.letterSpacing + 'px'
      }"
    >
      <div v-for="(row, idx) in content" :key="idx" class="" :data-idx="idx" v-html="row"></div>
    </div>

    <div class="topbar absolute top-0 left-0 h-30 w-full px-10">
      <div class="topbar__menu flex justify-end bg-[--vscode-sideBar-background]">
        <div v-if="lastChapter" class="vsc-toolbar-btn codicon codicon-arrow-left" title="上一章" @click="onPrevChapter"></div>
        <div v-if="nextChapter" class="vsc-toolbar-btn codicon codicon-arrow-right" title="下一章" @click="onNextChapter"></div>
        <div class="vsc-toolbar-btn codicon codicon-arrow-up" title="上一屏" @click="onPageUp"></div>
        <div class="vsc-toolbar-btn codicon codicon-arrow-down" title="下一屏" @click="onPageDown"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useContent } from '@/pages/common/content';

const contentRef = ref();

const { content, settingStore, lastChapter, nextChapter, onPageUp, onPageDown, onPrevChapter, onNextChapter, loading } = useContent(contentRef);
</script>

<style scoped>
:deep(p) {
  margin: 0;
  padding: 0;
}
:deep(img) {
  max-width: 100%;
  margin: 0 auto;
  display: block;
}

.topbar {
  .topbar__menu {
    transform: translateY(-100%);
    transition: all ease 0.3s;
  }

  &:hover {
    .topbar__menu {
      transform: translateY(0);
    }
  }
}
</style>

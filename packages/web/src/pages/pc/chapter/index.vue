<template>
  <div class="h-full p-10 overflow-hidden">
    <div
      ref="chaptersRef"
      class="w-600 max-w-100% p-10 mx-a overflow-auto h-full p-10 text-[--ar-color-text-secondary] bg-[--ar-chapter-bg] rounded-10"
    >
      <a-spin v-if="loading" :spinning="loading" class="w-full h-full !flex items-center justify-center" />
      <template v-else-if="list.length">
        <div
          v-for="item in list"
          :key="item.url"
          class="w-full h-32 lh-32 hover:bg-[--ar-color-primary-bg] hover:text-[--ar-color-primary-text] cursor-pointer px-8 overflow-hidden whitespace-nowrap text-ellipsis rounded-2"
          :class="[
            isLastRead(item) ? 'text-[--ar-color-primary-text]' : 'text-[--ar-color-text]',
            {
              'op-70': !!findHistory(item)
            }
          ]"
          :data-url="item.chapterPath"
          @click="showContent(item)"
        >
          {{ item.name }}
        </div>
      </template>
      <div v-else class="flex justify-center items-center h-full">
        <a-empty />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChapter } from '@/pages/common/chapter';

const { chaptersRef, showContent, loading, list, findHistory, isLastRead } = useChapter();
</script>

<template>
  <div class="h-full overflow-hidden p-10">
    <div
      ref="chaptersRef"
      class="mx-a h-full max-w-100% w-600 overflow-auto rounded-10 bg-[--ar-chapter-bg] p-10 p-10 text-[--ar-color-text-secondary]"
    >
      <a-spin v-if="loading" :spinning="loading" class="h-full w-full items-center justify-center !flex" />
      <template v-else-if="list.length">
        <div
          v-for="item in list"
          :key="item.url"
          class="h-32 w-full cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded-2 px-8 lh-32 hover:bg-[--ar-color-primary-bg] hover:text-[--ar-color-primary-text]"
          :class="[
            isLastRead(item) ? 'text-[--ar-color-primary-text]' : 'text-[--ar-color-text]',
            {
              'op-70': !!findHistory(item)
            }
          ]"
          :title="item.name"
          :data-url="item.chapterPath"
          @click="showContent(item)"
        >
          {{ item.name }}
        </div>
      </template>
      <div v-else class="h-full flex items-center justify-center">
        <a-empty />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChapter } from '@/pages/common/chapter';

const { chaptersRef, showContent, loading, list, findHistory, isLastRead } = useChapter();
</script>

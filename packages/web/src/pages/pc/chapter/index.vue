<template>
  <div class="h-full flex flex-col overflow-hidden p-10">
    <!-- 添加搜索框 -->
    <div class="mx-a mb-10 max-w-100% w-600">
      <a-input v-model:value="searchQuery" placeholder="搜索章节..." allow-clear class="w-full">
        <template #prefix>
          <search-outlined />
        </template>
      </a-input>
    </div>

    <div
      ref="chaptersRef"
      class="mx-a max-w-100% w-600 flex-1 overflow-auto rounded-10 bg-[--ar-chapter-bg] p-10 p-10 text-[--ar-color-text-secondary]"
    >
      <a-spin v-if="loading" :spinning="loading" class="h-full w-full items-center justify-center !flex" />
      <template v-else-if="list.length">
        <div
          v-for="item in filteredList"
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
import { ref, computed } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';

const { chaptersRef, showContent, loading, list, findHistory, isLastRead } = useChapter();

// 搜索
const searchQuery = ref('');
const filteredList = computed(() => {
  if (!searchQuery.value) return list.value;
  const query = searchQuery.value.toLowerCase();
  return list.value.filter((item) => item.name.toLowerCase().includes(query));
});
</script>

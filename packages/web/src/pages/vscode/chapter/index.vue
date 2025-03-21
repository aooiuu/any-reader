<template>
  <div class="h-full w-full flex flex-col overflow-hidden">
    <div v-if="loading" class="flex flex-1 items-center justify-center">
      <vscode-progress-ring></vscode-progress-ring>
    </div>
    <template v-else>
      <TreeItem v-if="ruleId" class="flex items-center" @click="star">
        <StarFilled v-if="isStarred" :size="14" />
        <StarOutlined v-else :size="14" />
        <span class="mb-2 ml-2">{{ isStarred ? '移出收藏' : '加入收藏' }}</span>
      </TreeItem>

      <!-- 添加搜索框 -->
      <div class="mb-2 px-2">
        <vscode-text-field v-model="searchQuery" placeholder="搜索章节..." class="w-full"></vscode-text-field>
      </div>

      <div ref="chaptersRef" class="flex-1 overflow-auto">
        <TreeItem
          v-for="item in filteredList"
          :key="item.url"
          :data-url="item.chapterPath"
          :class="[
            isLastRead(item) ? '!text-[--vscode-textLink-foreground]' : '',
            {
              'op-70': !!findHistory(item)
            }
          ]"
          @click="showContent(item)"
        >
          {{ item.name }}
        </TreeItem>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import TreeItem from '@/components/vsc/TreeItem.vue';
import { useChapter } from '@/pages/common/chapter';
import { ref, computed } from 'vue';

const { ruleId, chaptersRef, showContent, list, findHistory, isStarred, star, isLastRead, loading } = useChapter();

// 搜索
const searchQuery = ref('');
const filteredList = computed(() => {
  if (!searchQuery.value) return list.value;
  const query = searchQuery.value.toLowerCase();
  return list.value.filter((item) => item.name.toLowerCase().includes(query));
});
</script>

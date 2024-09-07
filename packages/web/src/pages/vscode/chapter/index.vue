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
      <div ref="chaptersRef" class="flex-1 overflow-auto">
        <TreeItem
          v-for="item in list"
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

const { ruleId, chaptersRef, showContent, list, findHistory, isStarred, star, isLastRead, loading } = useChapter();
</script>

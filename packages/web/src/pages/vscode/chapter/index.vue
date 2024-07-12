<template>
  <div class="w-full h-full flex flex-col overflow-hidden">
    <TreeItem v-if="ruleId" class="flex items-center" @click="star">
      <StarFilled v-if="isStarred" :size="14" />
      <StarOutlined v-else :size="14" />
      <span class="ml-2 mb-2">{{ isStarred ? '移出收藏' : '加入收藏' }}</span>
    </TreeItem>
    <div ref="chaptersRef" class="flex-1 overflow-auto">
      <TreeItem
        v-for="item in list"
        :key="item.url"
        :data-url="item.chapterPath"
        :class="{
          'op-70': !!findHistory(item)
        }"
        @click="showContent(item)"
      >
        {{ item.name }}
      </TreeItem>
    </div>
  </div>
</template>

<script setup>
import { StarOutlined, StarFilled } from '@ant-design/icons-vue';
import TreeItem from '@/components/vsc/TreeItem.vue';
import { useChapter } from '@/pages/common/chapter';

const { chaptersRef, showContent, list, findHistory, isStarred, star } = useChapter();
</script>

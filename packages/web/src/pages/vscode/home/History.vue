<template>
  <div class="w-full">
    <TreeItem v-for="item in historyStore.list" :key="item.url" class="reader-node" @click="showChapter(item)">
      <div class="flex items-center">
        <div class="flex-1 overflow-hidden whitespace-nowrap text-ellipsis">{{ item.name }}</div>
        <div class="codicon codicon-close" title="删除" @click.stop="remove(item)"></div>
      </div>
    </TreeItem>
  </div>
</template>

<script setup>
import { useHistoryStore } from '@/stores/history';
import TreeItem from '@/components/vsc/TreeItem.vue';
import { removeHistory } from '@/api';

const router = useRouter();

const historyStore = useHistoryStore();

historyStore.sync();

function showChapter(item) {
  router.push({
    path: '/chapter',
    query: {
      ...item,
      filePath: item.url,
      ruleId: item.ruleId
    }
  });
}

async function remove(item) {
  await removeHistory({ ruleId: item.ruleId, url: item.url });
  historyStore.sync();
}
</script>

<style scss>
.reader-node {
  .codicon-close {
    display: none;
    cursor: pointer;
  }

  &:hover {
    .codicon-close {
      display: block;
    }
  }
}
</style>

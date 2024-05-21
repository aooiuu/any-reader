<template>
  <div class="w-full">
    <TreeItem v-for="item in historyStore.list" :key="item.url" @click="showChapter(item)">
      {{ item.name }}
    </TreeItem>
  </div>
</template>

<script setup>
import { useHistoryStore } from '@/stores/history';
import TreeItem from '@/components/vsc/TreeItem.vue';

const router = useRouter();

const historyStore = useHistoryStore();

historyStore.sync();

function showChapter(item) {
  router.push({
    path: '/chapter',
    query: {
      filePath: item.url,
      ruleId: item.ruleId
    }
  });
}
</script>

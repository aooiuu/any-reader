<template>
  <div>
    <TreeItem v-for="item in list" :key="item.url" @click="showContent(item)">
      {{ item.name }}
    </TreeItem>
  </div>
</template>

<script setup>
import { getChapter } from '@/api';
import TreeItem from '@/components/vsc/TreeItem.vue';

const route = useRoute();
const router = useRouter();

const list = ref([]);

async function init() {
  list.value = [];
  const { filePath, ruleId } = route.query;
  if (!filePath && !ruleId) return;
  const res = await getChapter(filePath, ruleId).catch(() => {});
  if (res?.code === 0) {
    list.value = res?.data || [];
  }
}

init();

function showContent(item) {
  const { filePath, ruleId } = route.query;
  router.push({
    path: '/content',
    query: {
      filePath,
      ruleId,
      chapterPath: item.url || item.chapterPath
    }
  });
}
</script>

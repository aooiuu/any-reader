<template>
  <div>
    <TreeItem v-for="item in list" :key="item.url" @click="showContent(item)">
      {{ item.name }}
    </TreeItem>
  </div>
</template>

<script setup>
import { getChapter, getContent } from '@/api';
import { CONTENT_TYPE } from '@/constants';
import TreeItem from '@/components/vsc/TreeItem.vue';
import { useRulesStore } from '@/stores/rules';

const route = useRoute();
const router = useRouter();
const rulesStore = useRulesStore();

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

async function showContent(item) {
  const { filePath, ruleId } = route.query;
  const rule = rulesStore.list.find((e) => e.id === ruleId);
  if (rule?.contentType === CONTENT_TYPE.VIDEO) {
    const res = await getContent({
      filePath,
      ruleId,
      chapterPath: item.url || item.chapterPath
    }).catch(() => {});
    if (res?.code === 0) {
      router.push({
        path: '/player',
        query: {
          url: res?.data?.content || ''
        }
      });
      return;
    }
  } else if (rule?.contentType === CONTENT_TYPE.AUDIO) {
    // TODO: 音频规则, 待优化
    const res = await getContent({
      filePath,
      ruleId,
      chapterPath: item.url || item.chapterPath
    }).catch(() => {});
    console.log('getContent', res);
    if (res?.code === 0) {
      router.push({
        path: '/iframe',
        query: {
          url: res?.data?.content || ''
        }
      });
      return;
    }
  }

  router.push({
    name: 'content',
    query: {
      filePath,
      ruleId,
      chapterPath: item.url || item.chapterPath
    }
  });
}
</script>

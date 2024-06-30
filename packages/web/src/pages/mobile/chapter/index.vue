<template>
  <div class="h-full">
    <div v-if="loading" class="w-full h-full flex items-center justify-center">
      <van-loading type="spinner" size="20" />
    </div>
    <template v-else-if="list.length">
      <div class="h-full overflow-auto">
        <van-cell v-for="item in list" :key="item.name" :title="item.name" @click="showContent(item)" />
      </div>
    </template>
    <div v-else class="flex justify-center items-center h-full">
      <van-empty />
    </div>
  </div>
</template>

<script setup>
import { CONTENT_TYPE } from '@/constants';
import { getChapter } from '@/api';
import { useRulesStore } from '@/stores/rules';

const route = useRoute();
const router = useRouter();
const rulesStore = useRulesStore();
const loading = ref(false);

const list = ref([]);

async function init() {
  list.value = [];
  const { filePath, ruleId } = route.query;
  if (!filePath && !ruleId) return;
  loading.value = true;
  const res = await getChapter(filePath, ruleId).catch(() => {});
  loading.value = false;
  if (res?.code === 0) {
    list.value = res?.data || [];
  }
}

init();

async function showContent(item) {
  const { filePath, ruleId } = route.query;
  const rule = rulesStore.list.find((e) => e.id === ruleId);
  if (rule?.contentType === CONTENT_TYPE.VIDEO) {
    return;
  } else if (rule?.contentType === CONTENT_TYPE.AUDIO) {
    // TODO: 音频规则
    return;
  }

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

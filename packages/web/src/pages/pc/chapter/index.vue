<template>
  <div class="w-400 mx-a my-10 overflow-auto h-full p-10 bg-[#252525] rounded-10">
    <div
      v-for="item in list"
      :key="item.url"
      class="w-full text-[--foreground] h-22 lh-22 hover:bg-[--activityBar-background] cursor-pointer px-8 overflow-hidden whitespace-nowrap text-ellipsis rounded-2"
      @click="showContent(item)"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script setup>
import { getChapter, getContent } from '@/api';
import { useRulesStore } from '@/stores/rules';

const route = useRoute();
const router = useRouter();
const rulesStore = useRulesStore();

const list = ref([]);
rulesStore.sync();

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
  if (rule?.contentType === 2) {
    const res = await getContent({
      filePath,
      ruleId,
      chapterPath: item.url || item.path
    }).catch(() => {});
    console.log('getContent', res);
    if (res?.code === 0) {
      router.push({
        path: '/pc/player',
        query: {
          url: res?.data?.content || ''
        }
      });
      return;
    }
  }

  router.push({
    path: '/pc/content',
    query: {
      filePath,
      ruleId,
      chapterPath: item.url || item.path
    }
  });
}
</script>

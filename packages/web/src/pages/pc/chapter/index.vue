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
import { getChapter } from '@/api';

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
    path: '/pc/content',
    query: {
      filePath,
      ruleId,
      chapterPath: item.url || item.path
    }
  });
}
</script>

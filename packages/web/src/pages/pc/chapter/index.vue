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
import { stringify } from 'qs';
import { CONTENT_TYPE } from '@/constants';
import { getChapter, getContent } from '@/api';
import { openWindow } from '@/api/electron';
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
  if (rule?.contentType === CONTENT_TYPE.VIDEO) {
    const res = await getContent({
      filePath,
      ruleId,
      chapterPath: item.url || item.chapterPath
    }).catch(() => {});
    console.log('getContent', res);
    if (res?.code === 0) {
      openWindow({
        url:
          '/player?' +
          stringify({
            url: res?.data?.content || ''
          })
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
      openWindow({
        url:
          '/iframe?' +
          stringify({
            url: res?.data?.content || ''
          })
      });
      return;
    }
  }

  router.push({
    path: '/pc/content',
    query: {
      filePath,
      ruleId,
      chapterPath: item.url || item.chapterPath
    }
  });
}
</script>

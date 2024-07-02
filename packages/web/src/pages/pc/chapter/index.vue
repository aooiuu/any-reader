<template>
  <div class="w-400 mx-a my-10 overflow-auto h-full p-10 text-[--ar-color-text-secondary] bg-[--activityBar-background] rounded-10">
    <a-spin v-if="loading" :spinning="loading" class="w-full h-full !flex items-center justify-center" />
    <template v-else-if="list.length">
      <div
        v-for="item in list"
        :key="item.url"
        class="w-full text-[--foreground] h-32 lh-32 hover:bg-[--ar-color-primary-bg] hover:text-[--ar-color-primary-text] cursor-pointer px-8 overflow-hidden whitespace-nowrap text-ellipsis rounded-2"
        @click="showContent(item)"
      >
        {{ item.name }}
      </div>
    </template>
    <div v-else class="flex justify-center items-center h-full">
      <a-empty />
    </div>
  </div>
</template>

<script setup>
import { stringify } from 'qs';
import { App } from 'ant-design-vue';
import { CONTENT_TYPE } from '@/constants';
import { getChapter, getContent } from '@/api';
import { openWindow } from '@/api/electron';
import { useRulesStore } from '@/stores/rules';

const { message } = App.useApp();

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
  const { filePath, ruleId, name } = route.query;
  const rule = rulesStore.list.find((e) => e.id === ruleId);
  if (rule?.contentType === CONTENT_TYPE.VIDEO) {
    loading.value = true;
    const res = await getContent({
      filePath,
      ruleId,
      chapterPath: item.url || item.chapterPath
    }).catch(() => {});
    loading.value = false;
    const url = res?.data?.content || '';
    if (res?.code === 0 && url) {
      openWindow({
        url:
          '/player?' +
          stringify({
            url,
            name,
            chapterName: item.name
          })
      });
    } else {
      message.warning('获取地址失败！');
    }
    return;
  } else if (rule?.contentType === CONTENT_TYPE.AUDIO) {
    // TODO: 音频规则, 待优化
    const res = await getContent({
      filePath,
      ruleId,
      chapterPath: item.url || item.chapterPath
    }).catch(() => {});
    console.log('getContent', res);
    const url = res?.data?.content || '';
    if (res?.code === 0) {
      openWindow({
        url:
          '/iframe?' +
          stringify({
            url,
            name,
            chapterName: item.name
          })
      });
      return;
    }
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

<template>
  <div class="h-full flex flex-col">
    <van-nav-bar :title="route.query.name" left-text="返回" left-arrow @click-left="router.back" />

    <div ref="contentRef" class="w-full h-66vw bg-[--van-cell-background]"></div>

    <div class="flex-1 overflow-hidden my-20 mx-10 rounded-10 p-10 bg-[--van-cell-background]">
      <van-skeleton v-if="loading" class="w-full flex flex-col">
        <template #template>
          <van-skeleton-paragraph v-for="_ in 10" :key="_" class="w-full !h-24px" />
        </template>
      </van-skeleton>
      <div v-else class="h-full overflow-auto">
        <van-cell v-for="item in list" :key="item.name" :title="item.name" @click="showContent(item)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Hls from 'hls.js';
import DPlayer from 'dplayer';
import { getChapter, getContent } from '@/api';

const route = useRoute();
const router = useRouter();

const contentRef = ref();
const list = ref([]);
const loading = ref(false);

async function init() {
  list.value = [];
  const { filePath, ruleId } = route.query;
  if (!filePath && !ruleId) return;
  loading.value = true;
  const res = await getChapter(filePath, ruleId).catch(() => {});
  loading.value = false;
  if (res?.code === 0) {
    list.value = res?.data || [];
    if (list.value.length) {
      showContent(list.value[0]);
    }
  }
}

async function showContent(item) {
  const { filePath, ruleId } = route.query;
  loading.value = true;
  const res = await getContent({
    filePath,
    ruleId,
    chapterPath: item.url || item.chapterPath
  }).catch(() => {});
  loading.value = false;
  const url = res?.data?.content || '';
  if (res?.code === 0 && url) {
    play(url);
  }
  return;
}

function play(url) {
  new DPlayer({
    container: contentRef.value,
    autoplay: true,
    video: {
      url: url,
      type: 'customHls',
      customType: {
        customHls: function (video) {
          const hls = new Hls();
          hls.loadSource(video.src);
          hls.attachMedia(video);
        }
      }
    }
  });
}

onMounted(() => {
  init();
});
</script>

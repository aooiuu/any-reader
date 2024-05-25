<template>
  <div class="w-full h-full flex flex-col overflow-hidden">
    <div
      ref="contentRef"
      :style="{
        fontSize: settingStore.data.readStyle.fontSize + 'px',
        lineHeight: settingStore.data.readStyle.lineHeight,
        letterSpacing: settingStore.data.readStyle.letterSpacing + 'px',
        color: settingStore.data.readStyle.textColor,
        backgroundColor: settingStore.data.readStyle.backgroundColor
      }"
      class="flex-1 p-10 whitespace-pre-wrap overflow-auto lh-1.5em text-[#b3b3b3]"
      v-html="content"
    />
  </div>
</template>

<script setup>
import { getContent } from '@/api';
import { useChaptersStore } from '@/stores/chapters';
import { useSettingStore } from '@/stores/setting';
import { useKeyboard } from './keyboard';

const route = useRoute();
const router = useRouter();
const chaptersStore = useChaptersStore();
const settingStore = useSettingStore();

const content = ref('');
const contentRef = ref();

const chapterPath = ref('');
const lastChapter = computed(() => {
  if (!chapterPath.value) return '';
  const idx = chaptersStore.chapters.findIndex((e) => e.chapterPath === chapterPath.value);
  const item = idx === 0 ? null : chaptersStore.chapters[idx - 1];
  return item?.chapterPath || '';
});
const nextChapter = computed(() => {
  if (!chapterPath.value) return '';
  const idx = chaptersStore.chapters.findIndex((e) => e.chapterPath === chapterPath.value) + 1;
  if (idx === 0) return '';
  const item = chaptersStore.chapters.length - 1 < idx ? null : chaptersStore.chapters[idx];
  return item?.chapterPath || '';
});

// 初始化
async function init() {
  content.value = '';
  lastChapter.value = '';
  nextChapter.value = '';
  const res = await getContent(route.query).catch(() => {});

  chapterPath.value = route.query.chapterPath;

  chaptersStore.getChapters(route.query.filePath, route.query.ruleId);
  if (res?.code === 0) {
    content.value = res?.data?.content || '';
  }
  nextTick(() => {
    contentRef.value.scrollTop = 0;
  });
}

// 路由被改变
watch(() => route.query, init, {
  immediate: true,
  deep: true
});

// 上一章
function onPrevChapter() {
  if (!lastChapter.value) return;
  router.push({
    name: route.name,
    query: {
      ...route.query,
      chapterPath: lastChapter.value
    }
  });
}

// 下一章
function onNextChapter() {
  if (!nextChapter.value) return;
  router.push({
    name: route.name,
    query: {
      ...route.query,
      chapterPath: nextChapter.value
    }
  });
}

// 上一页
function onPageUp() {
  contentRef.value.scrollTop = contentRef.value.scrollTop - contentRef.value.offsetHeight + 5;
}

// 下一页
function onPageDown() {
  contentRef.value.scrollTop = contentRef.value.scrollTop + contentRef.value.offsetHeight - 5;
}

// 监听热键
useKeyboard({}, (cmd) => {
  const cmdMap = {
    prevChapter: onPrevChapter,
    nextChapter: onNextChapter,
    pageUp: onPageUp,
    pageDown: onPageDown
  };
  cmdMap[cmd] && cmdMap[cmd]();
});
</script>

<style scoped>
::v-deep p {
  margin: 0;
  padding: 0;
}
</style>

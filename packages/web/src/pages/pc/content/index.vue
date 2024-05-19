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

const route = useRoute();
const chaptersStore = useChaptersStore();
const settingStore = useSettingStore();

const content = ref('');
const contentRef = ref();

const chapterPath = ref('');
const lastChapter = computed(() => {
  if (!chapterPath.value) return '';
  const idx = chaptersStore.chapters.findIndex((e) => e.path === chapterPath.value);
  const item = idx === 0 ? null : chaptersStore.chapters[idx - 1];
  return item?.path || '';
});
const nextChapter = computed(() => {
  if (!chapterPath.value) return '';
  const idx = chaptersStore.chapters.findIndex((e) => e.path === chapterPath.value) + 1;
  if (idx === 0) return '';
  const item = chaptersStore.chapters.length - 1 < idx ? null : chaptersStore.chapters[idx];
  return item?.path || '';
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
</script>

<style scoped>
::v-deep p {
  margin: 0;
  padding: 0;
}
</style>

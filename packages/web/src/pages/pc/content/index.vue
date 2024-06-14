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

  <div
    v-if="chaptersVisible"
    ref="chaptersRef"
    class="fixed top-5 left-50% translate-x--50% rounded-4 overflow-hidden h-400 w-400 flex flex-col"
    :style="{
      boxShadow: '0px 0px 5px 5px rgba(0, 0, 0, 0.2)',
      color: settingStore.data.readStyle.textColor,
      backgroundColor: settingStore.data.readStyle.backgroundColor
    }"
  >
    <div
      class="p-10 cursor-pointer text-center overflow-hidden whitespace-nowrap text-ellipsis b-b-1 b-b-solid b-b-[#00000033] pb-4 mb-4"
      @click="scrollIntoViewChapter"
    >
      {{ readStore.title || '-' }}
    </div>

    <div class="h-full overflow-auto" style="scrollbar-width: none">
      <div
        v-for="chapter in chaptersStore.chapters"
        :key="chapter.name"
        :title="chapter.name"
        :class="[
          'px-10 overflow-hidden whitespace-nowrap text-ellipsis lh-24 hover:bg-[#00000026] cursor-pointer',
          readStore.path === chapter.chapterPath ? 'bg-[#00000026]' : ''
        ]"
        @click="toChapter(chapter.chapterPath)"
      >
        {{ chapter.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { onClickOutside } from '@vueuse/core';
import { useChaptersStore } from '@/stores/chapters';
import { useReadStore } from '@/stores/read';
import { useOpenChaptersBox } from '@/utils/bus';
import { useContent } from './useContent';

const chaptersStore = useChaptersStore();
const readStore = useReadStore();

const chaptersVisible = ref(false);
const contentRef = ref();
const chaptersRef = ref();

onClickOutside(chaptersRef, () => (chaptersVisible.value = false));

const { settingStore, content, toChapter } = useContent(contentRef);

function scrollIntoViewChapter() {
  const el = chaptersRef.value.querySelector(`[title="${readStore.title}"]`);
  el.scrollIntoView({ behavior: 'instant' });
}

useOpenChaptersBox().on(() => {
  chaptersVisible.value = true;
  nextTick(scrollIntoViewChapter);
});
</script>

<style scoped>
::v-deep p {
  margin: 0;
  padding: 0;
}
</style>

<template>
  <div class="w-full h-full flex flex-col overflow-hidden">
    <div
      id="text-container"
      class="flex-1 p-10 whitespace-pre-wrap overflow-auto lh-1.5em text-[#b3b3b3]"
      :style="{
        fontSize: settingStore.data.readStyle.fontSize + 'px',
        lineHeight: settingStore.data.readStyle.lineHeight,
        letterSpacing: settingStore.data.readStyle.letterSpacing + 'px',
        color: settingStore.data.readStyle.textColor,
        backgroundColor: settingStore.data.readStyle.backgroundColor
      }"
    >
      <div ref="contentRef" v-html="content"></div>

      <div class="flex justify-center mt-10">
        <div v-if="lastChapter" type="primary" @click="onPrevChapter">
          <icon-left />
          上一章
        </div>
        <!-- <div type="primary" @click="showChapters">目录</div> -->
        <div v-if="nextChapter" type="primary" @click="onNextChapter">
          下一章
          <icon-right />
        </div>
      </div>
    </div>
  </div>

  <!-- 目录 -->
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
  </div>
</template>

<script setup>
import { onClickOutside } from '@vueuse/core';
import { useReadStore } from '@/stores/read';
import { useBus, EVENT_CHAPTERS_BOX } from '@/utils/bus';
import { useContent } from '@/pages/pc/content/useContent';

const readStore = useReadStore();

const chaptersVisible = ref(false);
const contentRef = ref();
const chaptersRef = ref();

onClickOutside(chaptersRef, () => (chaptersVisible.value = false));

const { settingStore, content, lastChapter, nextChapter, onPrevChapter, onNextChapter } = useContent(contentRef);

function scrollIntoViewChapter() {
  const el = chaptersRef.value.querySelector(`[title="${readStore.title}"]`);
  el.scrollIntoView({ behavior: 'instant' });
}

function showChapters() {
  chaptersVisible.value = true;
  nextTick(scrollIntoViewChapter);
}

useBus(EVENT_CHAPTERS_BOX).on(showChapters);
</script>

<style scoped>
::v-deep p {
  margin: 0;
  padding: 0;
}
</style>

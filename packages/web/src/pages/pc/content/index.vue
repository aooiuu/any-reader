<template>
  <div class="w-full h-full flex flex-col overflow-hidden">
    <div
      id="text-container"
      class="flex-1 p-10 whitespace-pre-wrap lh-1.5em text-[#b3b3b3] break-words flex flex-col overflow-hidden"
      :style="{
        fontSize: settingStore.data.readStyle.fontSize + 'px',
        lineHeight: settingStore.data.readStyle.lineHeight,
        letterSpacing: settingStore.data.readStyle.letterSpacing + 'px',
        color: settingStore.data.readStyle.textColor,
        backgroundColor: settingStore.data.readStyle.backgroundColor
      }"
    >
      <!-- 加载 -->
      <a-spin v-if="loading" :spinning="loading" class="w-full h-full !flex items-center justify-center" />
      <!-- 阅读区域 -->
      <div ref="contentRef" class="md:mx-60 indent-2em h-full flex-1 flex flex-col overflow-y-auto relative">
        <!-- 漫画 -->
        <template v-if="contentType === ContentType.MANGA">
          <img v-for="(row, idx) in content" :key="idx" :src="row" />
        </template>
        <!-- 小说 -->
        <template v-else>
          <div v-for="(row, idx) in content" :key="idx" class="center-row ease transition-300 transition-color" :data-idx="idx" v-html="row"></div>
        </template>

        <!-- 上下章节按钮 -->
        <div class="flex justify-center">
          <a-button-group>
            <a-button type="text" :disabled="!lastChapter" :style="{ color: settingStore.data.readStyle.textColor }" @click="onPrevChapter">
              <icon-left />
              上一章
            </a-button>
            <a-button type="text" :style="{ color: settingStore.data.readStyle.textColor }" @click="showChapters">目录</a-button>
            <a-button type="text" :disabled="!nextChapter" :style="{ color: settingStore.data.readStyle.textColor }" @click="onNextChapter">
              下一章
              <icon-right />
            </a-button>
          </a-button-group>
        </div>
      </div>
      <a-back-top class="hidden md:block" :visibility-height="100" :target="topTarget" />
    </div>
  </div>

  <!-- 目录 -->
  <div v-if="chaptersVisible" class="z-10 fixed top-0 left-0 right-0 bottom-0 bg-[#000000cc]">
    <div
      ref="chaptersRef"
      class="fixed top-0 left-0 right-0 md:top-5 md:left-50% md:translate-x--50% md:rounded-4 md:w-400 overflow-hidden h-400 flex flex-col"
      :style="{
        boxShadow: '0px 0px 5px 5px rgba(0, 0, 0, 0.2)',
        color: settingStore.data.readStyle.textColor,
        backgroundColor: settingStore.data.readStyle.backgroundColor
      }"
    >
      <div
        class="app-region-drag p-10 cursor-pointer text-center overflow-hidden whitespace-nowrap text-ellipsis b-b-1 b-b-solid b-b-[#00000033] pb-4 mb-4"
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
  </div>
</template>

<script setup lang="ts">
import { ContentType } from '@any-reader/rule-utils';
import { onClickOutside } from '@vueuse/core';
import { useChaptersStore } from '@/stores/chapters';
import { useReadStore } from '@/stores/read';
import { useBus, EVENT_CHAPTERS_BOX } from '@/utils/bus';
import { useContent } from '@/pages/common/content';

const chaptersStore = useChaptersStore();
const readStore = useReadStore();

const chaptersVisible = ref(false);
const contentRef = ref();
const chaptersRef = ref();

const topTarget = () => contentRef.value as HTMLElement;

onClickOutside(chaptersRef, () => (chaptersVisible.value = false));

const { settingStore, content, contentType, toChapter, lastChapter, nextChapter, onPrevChapter, onNextChapter, loading, sectionSpacing, fontWeight } =
  useContent(contentRef);

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
:deep(p) {
  margin: 0;
  padding: 0;
}
:deep(img) {
  max-width: 100%;
  margin: 0 auto;
  display: block;
}

.center-row {
  margin-bottom: v-bind(sectionSpacing);
  font-weight: v-bind(fontWeight);
}
</style>

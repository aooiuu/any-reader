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
import { useContent } from './useContent';

const contentRef = ref();

const { settingStore, content } = useContent(contentRef);
</script>

<style scoped>
::v-deep p {
  margin: 0;
  padding: 0;
}
</style>

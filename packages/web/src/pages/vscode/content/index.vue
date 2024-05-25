<template>
  <div class="w-full h-full flex flex-col overflow-hidden">
    <div ref="contentRef" class="flex-1 p-10 whitespace-pre-wrap overflow-auto lh-1.5em" v-html="content" />
  </div>
</template>

<script setup>
import { useContent } from '@/pages/pc/content/useContent';

const contentRef = ref();

const { content } = useContent(contentRef);
</script>

<style scoped>
::v-deep p {
  margin: 0;
  padding: 0;
}
</style>

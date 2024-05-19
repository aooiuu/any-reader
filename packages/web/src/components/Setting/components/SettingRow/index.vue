<template>
  <div class="flex items-center h-44 lh-44 px-10 b-b b-1 b-solid b-[--titleBar-border-bottom]">
    <div class="flex-1">{{ props.title }}</div>
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="h-44 flex items-center b-b b-b-1 b-b-[--ar-color-border] b-b-solid px-10 lh-44">
    <div class="flex-1">{{ props.title }}</div>
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="flex flex-col px-10 mb-10">
    <div class="mb-5">{{ props.title }}</div>
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>

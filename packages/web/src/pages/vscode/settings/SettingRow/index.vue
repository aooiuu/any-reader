<template>
  <div class="mb-10 flex flex-col px-10">
    <div class="mb-5">{{ props.title }}</div>
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>

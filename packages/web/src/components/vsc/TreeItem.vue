<template>
  <div
    class="h-22 w-full cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap px-8 text-[--foreground] lh-22 hover:bg-[--list-hoverBackground]"
    :title="title"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

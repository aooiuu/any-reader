<template>
  <iframe class="h-full w-full border-none" :src="url" />
</template>

<script setup>
const route = useRoute();

const url = computed(() => route.query.url);
</script>

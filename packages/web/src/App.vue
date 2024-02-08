<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useMessage } from './utils/postMessage';

const router = useRouter();

document.body.setAttribute('arco-theme', 'dark');

useMessage('router.push', (data: string) => {
  router.push(data);
});
</script>

<template>
  <RouterView />
</template>

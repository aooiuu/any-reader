<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div class="flex-1 overflow-auto">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useMessage } from '@/utils/postMessage';
import { useRulesStore } from '@/stores/rules';
import { useFavoritesStore } from '@/stores/favorites';

const router = useRouter();

useRulesStore().sync();
useFavoritesStore().sync();

document.body.setAttribute('arco-theme', 'dark');

useMessage('router.push', (data: string) => {
  router.push(data);
});
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden">
    <div class="flex-1 overflow-auto">
      <RouterView v-slot="{ Component, route }">
        <KeepAlive>
          <component :is="Component" v-if="route.meta.keepAlive" :key="route.fullPath" />
        </KeepAlive>
        <component :is="Component" v-if="!route.meta.keepAlive" :key="route.fullPath" />
      </RouterView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useMessage } from '@/utils/postMessage';

const router = useRouter();

document.body.setAttribute('arco-theme', 'dark');

useMessage('router.push', (data: string) => {
  router.push(data);
});
</script>

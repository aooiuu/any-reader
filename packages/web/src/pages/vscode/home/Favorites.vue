<template>
  <div class="w-full">
    <TreeItem v-for="item in favoritesStore.list" :key="item.url" @click="showChapter(item)">
      {{ item.name }}
    </TreeItem>
  </div>
</template>

<script setup>
import { useFavoritesStore } from '@/stores/favorites';
import TreeItem from '@/components/vsc/TreeItem.vue';

const router = useRouter();
const favoritesStore = useFavoritesStore();

favoritesStore.sync();

function showChapter(item) {
  router.push({
    path: '/chapter',
    query: {
      filePath: item.url,
      ruleId: item.ruleId
    }
  });
}
</script>

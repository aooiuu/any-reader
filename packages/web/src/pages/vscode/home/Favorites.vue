<template>
  <div class="w-full">
    <TreeItem v-for="item in favoritesStore.list" :key="item.url" :title="item.name" class="reader-node" @click="showChapter(item)">
      <div class="flex items-center">
        <div class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap" :title="item.name">{{ item.name }}</div>
        <div class="codicon codicon-close" title="删除" @click.stop="remove(item)"></div>
      </div>
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
      ...item,
      filePath: item.url,
      ruleId: item.ruleId
    }
  });
}

async function remove(item) {
  favoritesStore.unstar({
    ...item
  });
}
</script>

<style scss>
.reader-node {
  .codicon-close {
    display: none;
    cursor: pointer;
  }

  &:hover {
    .codicon-close {
      display: block;
    }
  }
}
</style>

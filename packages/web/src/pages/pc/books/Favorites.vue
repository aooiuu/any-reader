<template>
  <Book
    v-for="item in favoritesStore.list"
    :key="item.url"
    :cover="item.cover"
    :name="item.name"
    :file-path="item.url"
    :rule-id="item.ruleId"
    :author="item.author"
    class="node mr-10 mb-10"
  >
    <div
      class="star invisible absolute top-5 right-5 px-2 py-2 rounded-10 flex items-center justify-center text-[--foreground]"
      @click.stop="favoritesStore.unstar({ url: item.url, ruleId: item.ruleId })"
    >
      <icon-star-fill v-if="favoritesStore.starred(item)" :size="14" />
      <icon-star v-else :size="14" />
    </div>
  </Book>
</template>

<script setup>
import { useFavoritesStore } from '@/stores/favorites';
import Book from './Book.vue';

const favoritesStore = useFavoritesStore();
</script>

<style lang="scss">
.node:hover {
  .star {
    visibility: visible;
    &:hover {
      background: rgba(0, 0, 0, 1);
    }
  }

  .cover {
    transform: scale(1.2);
  }
}
</style>

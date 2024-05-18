<template>
  <Book
    v-for="item in favoritesStore.list"
    :key="item.url"
    :cove="item.cover"
    :name="item.name"
    :file-path="item.url"
    :rule-id="item.ruleId"
    :author="item.author"
    class="mr-10 mb-10"
  />
</template>

<script setup>
import { useFavoritesStore } from '@/stores/favorites';
import Book from './Book.vue';

const favoritesStore = useFavoritesStore();

favoritesStore.sync();
</script>

<template>
  <Book
    v-for="item in historyStore.list"
    :key="item.url"
    :cover="item.cover"
    :name="item.name"
    :author="item.author"
    class="mb-10 mr-10"
    :file-path="item.url"
    :rule-id="item.ruleId"
  />
</template>

<script setup>
import { useHistoryStore } from '@/stores/history';
import Book from './Book.vue';

const historyStore = useHistoryStore();

historyStore.sync();
</script>

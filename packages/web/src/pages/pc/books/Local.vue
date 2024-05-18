<template>
  <Book v-for="item in list" :key="item.url" :cove="item.cover" :name="item.name" :author="item.author" class="mr-10 mb-10" :file-path="item.path" />
</template>

<script setup>
import { getLocalBooks } from '@/api';
import Book from './Book.vue';

const list = ref([]);

async function getBookList() {
  const res = await getLocalBooks();
  if (res?.code === 0) {
    list.value = res.data;
  } else {
    list.value = [];
  }
}

getBookList();
</script>

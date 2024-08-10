<template>
  <div v-if="!list.length" class="h-full w-full flex items-center justify-center">
    <a-empty>
      <template #description>
        <p>没有书籍, 设置里可以设置书籍目录</p>
      </template>
    </a-empty>
  </div>
  <template v-else>
    <Book
      v-for="item in list"
      :key="item.url"
      :cover="item.cover"
      :name="item.name"
      :author="item.author"
      class="mb-10 mr-10"
      :file-path="item.path"
    />
  </template>
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

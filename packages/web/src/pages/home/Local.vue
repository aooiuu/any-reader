<template>
  <div class="w-full">
    <TreeItem v-for="item in list" :key="item.path" @click="showChapter(item)">
      {{ item.name }}
    </TreeItem>
  </div>
</template>

<script setup>
import { getLocalBooks } from '@/api';
import TreeItem from '@/components/vsc/TreeItem.vue';

const router = useRouter();

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

function showChapter(item) {
  router.push({
    path: '/chapter',
    query: {
      filePath: item.path
    }
  });
}
</script>

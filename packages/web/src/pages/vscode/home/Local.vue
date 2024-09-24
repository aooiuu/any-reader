<template>
  <div class="h-full w-full flex flex-col">
    <div class="flex-1 overflow-auto">
      <TreeItem v-for="item in list" :key="item.path" @click="showChapter(item)">
        {{ item.name }}
      </TreeItem>
    </div>

    <vscode-divider />
    <div class="mx-8 my-4 flex cursor-pointer items-center hover:op-70" @click="openDir">
      <i class="codicon codicon-folder-opened mr-2"></i>
      打开本地目录
    </div>
    <vscode-divider />
  </div>
</template>

<script setup>
import { getLocalBooks } from '@/api';
import { openDir } from '@/api/modules/bookshelf';
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
      filePath: item.path,
      name: item.name
    }
  });
}
</script>

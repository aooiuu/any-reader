<template>
  <div class="h-full w-full flex flex-col">
    <a-spin :spinning="loading" class="flex-1 overflow-auto">
      <TreeItem v-for="item in list" :key="item.path" :title="item.name" @click="showChapter(item)">
        {{ item.name }}
      </TreeItem>
    </a-spin>

    <vscode-divider />
    <div class="mx-8 my-4 flex items-center hover:op-70" :class="[openDirLoading ? 'cursor-wait' : 'cursor-pointer']" @click="handleOpenDir">
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
const loading = ref(false);
const openDirLoading = ref(false);

async function getBookList() {
  try {
    loading.value = true;
    const res = await getLocalBooks();
    if (res?.code === 0) {
      list.value = res.data;
    } else {
      list.value = [];
    }
  } finally {
    loading.value = false;
  }
}

async function handleOpenDir() {
  if (openDirLoading.value) return;
  openDirLoading.value = true;
  try {
    await openDir();
  } finally {
    openDirLoading.value = false;
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

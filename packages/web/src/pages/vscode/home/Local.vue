<template>
  <div class="h-full w-full flex flex-col">
    <div v-if="loading" class="flex flex-1 items-center justify-center">
      <vscode-progress-ring></vscode-progress-ring>
    </div>
    <div v-else class="flex-1 overflow-auto">
      <TreeItem v-for="item in list" :key="item.path" :title="item.name" @click="showChapter(item)">
        {{ item.name }}
      </TreeItem>
    </div>

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
  loading.value = true;
  const res = await getLocalBooks().catch(() => {});
  list.value = res?.data || [];
  loading.value = false;
}

async function handleOpenDir() {
  if (openDirLoading.value) return;
  openDirLoading.value = true;
  await openDir().catch(() => {});
  openDirLoading.value = false;
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

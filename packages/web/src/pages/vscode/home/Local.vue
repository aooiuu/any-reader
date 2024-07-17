<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex-1 overflow-auto">
      <TreeItem v-for="item in list" :key="item.path" @click="showChapter(item)">
        {{ item.name }}
      </TreeItem>
    </div>

    <vscode-divider />
    <div
      class="my-4 mx-8 flex items-center"
      @click="
        executeCommand({
          command: 'any-reader.openLocalBookDir'
        })
      "
    >
      <i class="codicon codicon-folder-opened mr-2"></i>
      打开本地目录
    </div>
    <vscode-divider />
  </div>
</template>

<script setup>
import { getLocalBooks } from '@/api';
import { executeCommand } from '@/api/modules/vsc';
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

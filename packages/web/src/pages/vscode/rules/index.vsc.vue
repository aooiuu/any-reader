<template>
  <div class="w-full h-full flex flex-col overflow-hidden">
    <TreeItem @click="executeCommand({ command: 'any-reader.home' })">
      <div class="flex items-center"><i class="codicon codicon-surround-with mr-2"></i>编辑规则</div>
    </TreeItem>
    <TreeItem @click="executeCommand({ command: 'any-reader.editBookSource' })">
      <div class="flex items-center"><i class="codicon codicon-folder-opened mr-2"></i>打开规则文件</div>
    </TreeItem>
    <div class="flex-1 overflow-auto">
      <TreeItem v-for="item in rulesStore.list" :key="item.id">
        {{ item.name }}
      </TreeItem>
    </div>
  </div>
</template>

<script setup>
import { useRulesStore } from '@/stores/rules';
import TreeItem from '@/components/vsc/TreeItem.vue';
import { executeCommand } from '@/api/vsc';

const rulesStore = useRulesStore();

rulesStore.sync();
</script>

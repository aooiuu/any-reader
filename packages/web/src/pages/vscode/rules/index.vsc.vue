<template>
  <div class="w-full h-full flex flex-col overflow-hidden">
    <TreeItem @click="executeCommand({ command: 'any-reader.home' })">
      <div class="flex items-center"><i class="codicon codicon-surround-with mr-2"></i>编辑规则</div>
    </TreeItem>
    <TreeItem @click="executeCommand({ command: 'any-reader.editBookSource' })">
      <div class="flex items-center"><i class="codicon codicon-folder-opened mr-2"></i>打开规则文件</div>
    </TreeItem>
    <div class="flex-1 overflow-auto">
      <template v-if="rulesStore.list.length">
        <TreeItem v-for="item in rulesStore.list" :key="item.id">
          {{ item.name }}
        </TreeItem>
      </template>
      <div v-else class="my-10 h-full flex flex-col justify-center items-center px-10" @drop="dropRules.drop" @dragover.prevent @dragenter.prevent>
        <div v-if="dropRules.loading.value">导入中...</div>
        <div v-else>
          您还没有配置规则
          <!-- ,把规则文件拖动到这里快速导入,或者 -->
          <vscode-link @click="executeCommand({ command: 'any-reader.home' })">打开规则编辑页面</vscode-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRulesStore } from '@/stores/rules';
import TreeItem from '@/components/vsc/TreeItem.vue';
import { executeCommand } from '@/api/vsc';
import { useDropRules } from '@/hooks/useDropRules';

const rulesStore = useRulesStore();
const dropRules = useDropRules();

rulesStore.sync();
</script>

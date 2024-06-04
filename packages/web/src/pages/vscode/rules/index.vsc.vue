<template>
  <div class="w-full h-full flex flex-col overflow-hidden">
    <div class="p-10">
      <vscode-dropdown placeholder="全部规则" class="w-full" :value="'' + contentType" @input="(event) => (contentType = +event.target.value)">
        <vscode-option v-for="item in CONTENT_TYPES" :key="item.value" :value="item.value">
          {{ item.label }}
        </vscode-option>
        <vscode-option :value="null"> 全部规则 </vscode-option>
      </vscode-dropdown>
    </div>
    <div class="flex-1 overflow-auto">
      <template v-if="rulesStore.list.length">
        <TreeItem v-for="item in rules" :key="item.id">
          <div class="reader-node flex items-center">
            <div class="flex-1 overflow-hidden whitespace-nowrap text-ellipsis">{{ item.name }}</div>
            <div
              class="codicon codicon-link-external"
              @click.stop="executeCommand({ command: 'any-reader.openUrl', data: ['/iframe?url=' + item.host] })"
            ></div>
          </div>
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
    <div class="flex justify-between">
      <TreeItem @click="executeCommand({ command: 'any-reader.home' })">
        <div class="flex items-center"><i class="codicon codicon-surround-with mr-2"></i>编辑</div>
      </TreeItem>
      <TreeItem @click="executeCommand({ command: 'any-reader.editBookSource' })">
        <div class="flex items-center justify-end"><i class="codicon codicon-folder-opened mr-2"></i>打开</div>
      </TreeItem>
    </div>
  </div>
</template>

<script setup>
import { CONTENT_TYPES } from '@/constants';
import { useRulesStore } from '@/stores/rules';
import TreeItem from '@/components/vsc/TreeItem.vue';
import { executeCommand } from '@/api/vsc';
import { useDropRules } from '@/hooks/useDropRules';

const contentType = ref(null);
const rulesStore = useRulesStore();
const dropRules = useDropRules();

const rules = computed(() => {
  if (!contentType.value) {
    return rulesStore.list;
  }
  return rulesStore.list.filter((e) => e.contentType === contentType.value);
});

rulesStore.sync();
</script>

<style lang="scss">
.reader-node {
  .codicon {
    display: none;
    cursor: pointer;
  }

  &:hover {
    .codicon {
      display: block;
    }
  }
}
</style>

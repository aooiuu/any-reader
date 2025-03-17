<template>
  <div class="h-full flex flex-col overflow-hidden p-8">
    <div v-if="!loading" class="flex">
      <div class="mr-2 h-full flex items-center vsc-toolbar-btn" @click="expand = !expand">
        <span class="codicon" :class="[expand ? 'codicon-chevron-down' : 'codicon-chevron-right']"></span>
      </div>
      <div class="flex-1">
        <vscode-text-field
          class="w-full"
          placeholder="按回车键搜索"
          :value="searchText"
          @input="(event:any) => (searchText = event.target.value)"
          @keyup.enter="onSearch"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
          <span slot="end" class="codicon codicon-search"></span>
        </vscode-text-field>

        <template v-if="expand">
          <!-- 规则类型 -->
          <vscode-dropdown class="w-full" :value="'' + contentType" @input="(event:any) => (contentType = +event.target.value)">
            <vscode-option v-for="item in CONTENT_TYPES.filter((e) => e.value !== ContentType.GAME)" :key="item.value" :value="item.value">
              {{ item.label }}
            </vscode-option>
          </vscode-dropdown>
          <!-- filter -->
          <vscode-dropdown class="mt-2 w-full" :value="'' + filterType" @input="(event:any) => (filterType = +event.target.value)">
            <vscode-option :value="1">默认</vscode-option>
            <vscode-option :value="2">包含关键字</vscode-option>
          </vscode-dropdown>
        </template>
      </div>
    </div>

    <div v-else class="flex items-center">
      <div v-if="runCount > 0" class="flex-1">
        <div class="text-12 op-70">搜索中: {{ runCount }}/{{ total }}</div>
      </div>
      <vscode-button appearance="Secondary" @click="cancelSearch">取消</vscode-button>
    </div>

    <div v-if="!rulesStore.list.length" class="py-20 text-center">您还没有配置规则！无法使用搜索功能！</div>

    <div class="mt-10 flex-1 overflow-auto">
      <template v-for="item in displayList" :key="item.rule.id">
        <div
          class="h-22 flex cursor-pointer items-center text-[--foreground] lh-22 hover:bg-[--list-hoverBackground]"
          @click="changeOpened(item.rule.id)"
        >
          <div class="flex flex-1 items-center overflow-hidden">
            <i class="codicon mr-6" :class="[item.opened ? 'codicon-chevron-down' : 'codicon-chevron-right']"></i>
            <div class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap" :title="item.rule.name">{{ item.rule.name }}</div>
          </div>
          <span class="ml-6 op-70">{{ item.list.length }}</span>
        </div>
        <template v-if="item.opened">
          <TreeItem v-for="(row, idx) in item.list" :key="idx" class="pl-22" :title="row.author" @click="getChapter(row, item.rule)">
            {{ row.name }}
          </TreeItem>
        </template>
      </template>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { ContentType } from '@any-reader/rule-utils';
import { CONTENT_TYPES } from '@/constants';
import TreeItem from '@/components/vsc/TreeItem.vue';
import { useSearch } from '@/pages/common/search';
import { useRulesStore } from '@/stores/rules';

const rulesStore = useRulesStore();

const expand = ref(false);
const filterType = ref(1);

const { contentType, searchText, onSearch, cancelSearch, loading, runCount, total, list, getChapter } = useSearch();

const displayList = computed<any[]>(() => {
  if (filterType.value === 1) {
    return list.value;
  }
  return list.value
    .map((ruleRow: any) => {
      return {
        ...ruleRow,
        list: ruleRow.list.filter((e: any) => e.name.includes(searchText.value))
      };
    })
    .filter((ruleRow: any) => ruleRow.list.length);
});

function changeOpened(ruleId: string) {
  const row = list.value.find((e) => e.rule.id === ruleId);
  if (row) {
    row.opened = !row.opened;
  }
}
</script>

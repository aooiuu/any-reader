<template>
  <div class="p-8 h-full overflow-hidden flex flex-col">
    <div v-if="!loading" class="flex">
      <div class="vsc-toolbar-btn mr-2 flex items-center h-full" @click="expand = !expand">
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
            <vscode-option v-for="item in CONTENT_TYPES" :key="item.value" :value="item.value">
              {{ item.label }}
            </vscode-option>
          </vscode-dropdown>
          <!-- filter -->
          <vscode-dropdown class="w-full mt-2" :value="'' + filterType" @input="(event:any) => (filterType = +event.target.value)">
            <vscode-option :value="1">默认</vscode-option>
            <vscode-option :value="2">包含关键字</vscode-option>
          </vscode-dropdown>
        </template>
      </div>
    </div>

    <div v-else class="flex items-center">
      <div v-if="runCount > 0" class="flex-1">
        <div class="op-70 text-12">搜索中: {{ runCount }}/{{ total }}</div>
      </div>
      <vscode-button appearance="Secondary" @click="cancelSearch">取消</vscode-button>
    </div>

    <div class="flex-1 overflow-auto mt-10">
      <template v-for="item in displayList" :key="item.id">
        <div class="flex items-center"><i class="codicon codicon-chevron-down mr-6"></i>{{ item.rule.name }}</div>
        <TreeItem v-for="(row, idx) in item.list" :key="idx" class="pl-22" :title="row.author" @click="getChapter(row, item.rule)">
          {{ row.name }}
        </TreeItem>
      </template>
    </div>
  </div>
</template>
<script setup lang="tsx">
import { v4 as uuidV4 } from 'uuid';
import pLimit from 'p-limit';
import { CONTENT_TYPES, CONTENT_TYPE } from '@/constants';
import { searchByRuleId } from '@/api';
import { useFavoritesStore } from '@/stores/favorites';
import { useRulesStore } from '@/stores/rules';
import TreeItem from '@/components/vsc/TreeItem.vue';

const favoritesStore = useFavoritesStore();
const rulesStore = useRulesStore();
const router = useRouter();

const runPromise = pLimit(5);

favoritesStore.sync();

let uuid: string = '';
const searchText = ref('');
const expand = ref(false);
const contentType = ref(CONTENT_TYPE.NOVEL);
const filterType = ref(1);
const loading = ref(false);
const total = ref(0);
const runCount = ref(0);

const list = ref<any[]>([]);
const displayList = computed(() => {
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

function onSearch() {
  const lastUuid = uuidV4();
  uuid = lastUuid;
  list.value = [];
  total.value = 0;
  runCount.value = 0;
  loading.value = true;

  rulesStore.sync().then(async () => {
    const rules = rulesStore.list.filter((e) => contentType.value === e.contentType && e.enableSearch);
    total.value = rules.length;

    const tasks = rules.map((rule) =>
      runPromise(async () => {
        if (lastUuid !== uuid) return;
        runCount.value++;
        const res = await searchByRuleId({ ruleId: rule.id, keyword: searchText.value });
        if (res.code === 0) {
          const rows = res.data;
          if (!rows.length) return;
          console.log({ rows });

          list.value.push({
            rule: rule,
            list: rows
          });
        }
      })
    );
    await Promise.all(tasks).catch(() => {});
    loading.value = false;
  });
}

function cancelSearch() {
  uuid = uuidV4();
  loading.value = false;
}

function getChapter(row: any, rule: any) {
  router.push({
    path: '/chapter',
    query: {
      filePath: row.url,
      ruleId: rule.id
    }
  });
}

onDeactivated(() => {
  cancelSearch();
});
</script>

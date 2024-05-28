<template>
  <div class="px-10 py-10 h-full flex flex-col">
    <div class="mb-10 flex gap-10">
      <div class="flex-1 flex items-center gap-10">
        <a-input-search v-model="searchText" placeholder="搜索" class="!w-140px" />
        <a-checkbox-group v-model="contentTypes">
          <a-checkbox v-for="item in CONTENT_TYPES" :key="item.value" :value="item.value">
            {{ item.label }}
          </a-checkbox>
        </a-checkbox-group>
      </div>
      <a-button type="primary" @click="pingAll">测速</a-button>
      <a-button type="primary" @click="addRule">
        <template #icon>
          <icon-plus />
        </template>
      </a-button>
    </div>
    <div class="flex-1 overflow-hidden">
      <a-table
        :pagination="true"
        :columns="tableColumns"
        :data="tableData"
        :scrollbar="true"
        :scroll="{
          y: '100%'
        }"
      />
    </div>
  </div>
</template>

<script setup lang="jsx">
import _ from 'lodash';
import { CONTENT_TYPES } from '@/constants';
import { useRulesStore } from '@/stores/rules';
import { updateRule, ping } from '@/api';
import { timeoutWith } from '@/utils/promise';
import { useRuleExtra } from './hooks/useRuleExtra';

const router = useRouter();
const rulesStore = useRulesStore();
const ruleExtra = useRuleExtra();
const pingIds = ref([]);

rulesStore.sync();
ruleExtra.sync();

const searchText = ref('');
const contentTypes = ref(CONTENT_TYPES.map((e) => e.value).flat());

function editRule(row) {
  router.push({
    path: '/pc/rule-info',
    query: {
      id: row.id
    }
  });
}

function sortableValue(obj, path) {
  return _.get(obj, path) || Number.MAX_SAFE_INTEGER;
}

const tableColumns = ref([
  {
    title: '名称',
    dataIndex: 'name',
    align: 'center',
    width: 100,
    sortable: {
      sortDirections: ['ascend', 'descend']
    }
  },
  {
    title: '域名',
    dataIndex: 'host',
    ellipsis: true,
    tooltip: true,
    sortable: {
      sortDirections: ['ascend', 'descend']
    }
  },
  {
    title: 'Ping',
    dataIndex: 'extra.ping',
    width: 100,
    align: 'center',
    render: ({ record }) => {
      const extra = record.extra;
      return (
        <a-button
          class={extra?.ping === -1 ? '!text-red' : ''}
          type="text"
          onClick={async () => {
            await ping(_.pick(record, ['id', 'host']));
            ruleExtra.sync();
          }}>
          {pingIds.value.includes(record.id) ? '-' : extra?.ping === -1 ? '超时' : extra?.ping || '测速'}
        </a-button>
      );
    },
    sortable: {
      sortDirections: ['ascend', 'descend'],
      sorter: (a, b, { direction }) => {
        if (direction === 'ascend') {
          return sortableValue(a, 'extra.ping') - sortableValue(b, 'extra.ping');
        }
        return sortableValue(b, 'extra.ping') - sortableValue(a, 'extra.ping');
      }
    }
  },
  {
    title: '作者',
    dataIndex: 'author',
    align: 'center',
    width: 100,
    ellipsis: true,
    tooltip: true,
    sortable: {
      sortDirections: ['ascend', 'descend']
    }
  },
  {
    title: '启用搜索',
    width: 120,
    align: 'center',
    render: ({ record }) => (
      <a-switch
        model-value={record.enableSearch}
        onUpdate:model-value={(v) =>
          updateRule({
            ...record,
            enableSearch: v
          }).then(() => {
            record.enableSearch = v;
          })
        }
      />
    ),
    sortable: {
      sortDirections: ['ascend', 'descend']
    }
  },
  {
    title: '启用发现',
    width: 120,
    align: 'center',
    render: ({ record }) => (
      <a-switch
        model-value={record.enableDiscover}
        onUpdate:model-value={(v) =>
          updateRule({
            ...record,
            enableDiscover: v
          }).then(() => {
            record.enableDiscover = v;
          })
        }
      />
    ),
    sortable: {
      sortDirections: ['ascend', 'descend']
    }
  },
  {
    title: '操作',
    width: 120,
    align: 'center',
    fixed: 'right',
    render: ({ record }) => (
      <a-button type="primary" shape="circle" onClick={() => editRule(record)}>
        <icon-edit />
      </a-button>
    )
  }
]);

const tableDataFilter = computed(() => {
  if (!searchText.value) return rulesStore.list.filter((e) => contentTypes.value.includes(e.contentType));
  return rulesStore.list.filter((e) => e.name?.includes(searchText.value) && contentTypes.value.includes(e.contentType));
});

const tableData = computed(() => {
  return tableDataFilter.value.map((e) => ({
    ...e,
    extra: ruleExtra.data.value[e.id] || {}
  }));
});

// 添加规则
function addRule() {
  router.push('/pc/rule-info');
}

async function pingAll() {
  const rows = _.chunk(tableDataFilter.value, 5);
  for (const row of rows) {
    pingIds.value = row.map((e) => e.id);
    await timeoutWith(Promise.all(row.map((e) => ping(_.pick(e, ['id', 'host'])))), 3000).catch(() => {});
    pingIds.value = [];
    await ruleExtra.sync();
  }
}
</script>

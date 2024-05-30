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
    </div>
    <div class="mb-10 flex gap-10">
      <a-button type="primary" @click="addRule">
        <template #icon>
          <icon-plus />
        </template>
        添加规则
      </a-button>
      <div class="flex-1" />
      <a-button type="primary" @click="pingAll">测速</a-button>
      <a-button type="primary" status="danger" @click="delTimeoutRules">一键删除超时规则</a-button>
      <a-dropdown position="bottom">
        <a-button>批量操作<icon-down /></a-button>
        <template #content>
          <a-doption @click="batchUpdate({ enableSearch: false })">禁用选中搜索</a-doption>
          <a-doption @click="batchUpdate({ enableDiscover: false })">禁用选中发现</a-doption>
          <div class="h-1 bg-[#ffffff33]"></div>
          <a-doption @click="batchUpdate({ enableSearch: true })">启用选中搜索</a-doption>
          <a-doption @click="batchUpdate({ enableDiscover: true })">启用选中发现</a-doption>
          <div class="h-1 bg-[#ffffff33]"></div>
          <a-doption @click="delSelected">删除选中</a-doption>
        </template>
      </a-dropdown>
    </div>
    <div class="flex-1 overflow-hidden">
      <a-table
        v-model:selectedKeys="selectedKeys"
        row-key="id"
        :pagination="true"
        :row-selection="{
          type: 'checkbox',
          showCheckedAll: true,
          onlyCurrent: true
        }"
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
import { Modal } from '@arco-design/web-vue';
import _ from 'lodash-es';
import { CONTENT_TYPES } from '@/constants';
import { useRulesStore } from '@/stores/rules';
import { ping, batchUpdateRules, delRules } from '@/api';
import { timeoutWith } from '@/utils/promise';
import { useRuleExtra } from './hooks/useRuleExtra';

const router = useRouter();
const rulesStore = useRulesStore();
const ruleExtra = useRuleExtra();
const pingIds = ref([]);
const selectedKeys = ref([]);

rulesStore.sync();
ruleExtra.sync();

const searchText = ref('');
const contentTypes = ref(CONTENT_TYPES.map((e) => e.value).flat());

function editRule(row) {
  router.push({
    name: 'ruleInfo',
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
    ellipsis: true,
    tooltip: true,
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
    title: '延迟',
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
          rulesStore.updateRuleById(record.id, {
            enableSearch: v
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
          rulesStore.updateRuleById(record.id, {
            enableDiscover: v
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
      <div class="flex gap-5">
        <a-button type="primary" shape="circle" onClick={() => editRule(record)}>
          <icon-edit />
        </a-button>
        <a-button type="primary" status="danger" shape="circle" onClick={() => delRule(record.id)}>
          <icon-delete />
        </a-button>
      </div>
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
  router.push({
    name: 'ruleInfo'
  });
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

async function batchUpdate(rule) {
  await batchUpdateRules({
    ids: [...selectedKeys.value],
    rule
  });
  rulesStore.sync();
}

// 删除规则
function delRule(id) {
  Modal.confirm({
    title: '提示',
    content: '规则删除后不可恢复',
    closable: true,
    onOk: async () => {
      await delRules({
        id
      });
      rulesStore.sync();
    }
  });
}

// 删除选中
function delSelected() {
  delRule([...selectedKeys.value]);
}

// 删除超时
function delTimeoutRules() {
  delRule(
    rulesStore.list
      .filter((rule) => {
        const extra = ruleExtra.data.value[rule.id];
        if (!extra) return false;
        if (extra.ping === -1) return true;
        return false;
      })
      .map((e) => e.id)
  );
}
</script>

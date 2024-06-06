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
    <input ref="fileInputRef" type="file" class="hidden" @change="changeFile" />
    <div class="mb-10 flex gap-10">
      <a-dropdown position="bottom">
        <a-button type="primary">添加规则<icon-down /></a-button>
        <template #content>
          <a-doption @click="addRuleUrl">从文本导入</a-doption>
          <a-doption @click="addRuleFile">从文件导入</a-doption>
          <a-doption @click="addRuleUrl">从URL导入</a-doption>
          <a-doption @click="addRule">单个添加</a-doption>
        </template>
      </a-dropdown>

      <div class="flex-1" />
      <a-button type="primary" @click="pingAll">测速</a-button>
      <a-button type="primary" status="danger" @click="delTimeoutRules">一键删除超时规则</a-button>
      <a-dropdown position="bottom" :disabled="!selectedKeys.length">
        <a-button :disabled="!selectedKeys.length">批量操作<icon-down /></a-button>
        <template #content>
          <a-doption @click="batchUpdate({ enableSearch: false })">禁用选中搜索</a-doption>
          <a-doption @click="batchUpdate({ enableDiscover: false })">禁用选中发现</a-doption>
          <div class="h-1 bg-[#ffffff33]"></div>
          <a-doption @click="batchUpdate({ enableSearch: true })">启用选中搜索</a-doption>
          <a-doption @click="batchUpdate({ enableDiscover: true })">启用选中发现</a-doption>
          <div class="h-1 bg-[#ffffff33]"></div>
          <a-doption @click="delSelected">删除选中</a-doption>
          <div class="h-1 bg-[#ffffff33]"></div>
          <a-doption @click="copySelected">复制选中</a-doption>
          <a-doption @click="exportSelected">导出选中</a-doption>
        </template>
      </a-dropdown>
    </div>
    <div class="flex-1 overflow-hidden" @drop="drop" @dragover.prevent @dragenter.prevent>
      <a-table
        v-model:selectedKeys="selectedKeys"
        :loading="loading"
        :draggable="{ type: 'handle', width: 40 }"
        row-key="id"
        :pagination="{
          showTotal: true,
          showJumper: true,
          showPageSize: true,
          pageSizeOptions: [10, 20, 50, 100, 500]
        }"
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
        @change="handleChange"
      >
        <template #empty>
          <div class="h-80 flex items-center justify-center">没有规则, 你可以拖拽规则 JSON 文件到这里导入</div>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="jsx">
import { Modal, Message } from '@arco-design/web-vue';
import _ from 'lodash-es';
import { encodeRule } from '@any-reader/rule-utils';
import { useClipboard } from '@vueuse/core';
import { saveAs } from 'file-saver';
import { CONTENT_TYPES } from '@/constants';
import { useRulesStore } from '@/stores/rules';
import { ping, batchUpdateRules, delRules, updateRuleSort } from '@/api';
import { timeoutWith } from '@/utils/promise';
import { useRuleExtra } from './hooks/useRuleExtra';
import { useDropRules } from '@/hooks/useDropRules';
import ImportRules from './ImportRules.vue';

const router = useRouter();
const rulesStore = useRulesStore();
const ruleExtra = useRuleExtra();
const pingIds = ref([]);
const selectedKeys = ref([]);
const loading = ref(false);
const fileInputRef = ref();

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

const LOG_CONFIG = [
  { url: 'post@searchByRuleId', title: '搜索' },
  { url: 'get@discoverMap', title: '发现分类' },
  { url: 'post@discover', title: '发现列表' },
  { url: 'post@getChapter', title: '章节列表' },
  { url: 'post@content', title: '内容' }
];

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
    },
    render: ({ record }) => {
      return (
        <a-link
          onClick={() => {
            window.open(record.host);
          }}>
          {record.host}
        </a-link>
      );
    }
  },
  {
    title: '延迟',
    dataIndex: 'extra.ping',
    width: 90,
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
    width: 100,
    align: 'center',
    filterable: {
      filters: [
        {
          text: '启用',
          value: true
        },
        {
          text: '禁用',
          value: false
        }
      ],
      filter: (value, record) => value.includes(record.enableSearch)
    },
    render: ({ record }) => (
      <a-switch
        model-value={record.enableSearch}
        onUpdate:model-value={(v) =>
          rulesStore.updateRuleById(record.id, {
            enableSearch: v
          })
        }
      />
    )
  },
  {
    title: '启用发现',
    width: 100,
    align: 'center',
    filterable: {
      filters: [
        {
          text: '启用',
          value: true
        },
        {
          text: '禁用',
          value: false
        }
      ],
      filter: (value, record) => value.includes(record.enableDiscover),
      multiple: false
    },
    render: ({ record }) => (
      <a-switch
        model-value={record.enableDiscover}
        onUpdate:model-value={(v) =>
          rulesStore.updateRuleById(record.id, {
            enableDiscover: v
          })
        }
      />
    )
  },
  {
    title: '接口调用',
    width: 140,
    align: 'center',
    filterable: {
      filters: LOG_CONFIG.map((log) => ({
        text: log.title + '失败>3且成功=0',
        value: log.url
      })),
      filter: (value, record) => {
        if (value.length !== 1) return true;
        const url = value[0];

        const ok = _.get(record, `extra.${url}.ok`, 0);
        const fail = _.get(record, `extra.${url}.fail`, 0);
        return ok === 0 && fail > 3;
      },
      multiple: false
    },
    sortable: {
      sortDirections: ['ascend', 'descend'],
      sorter: (a, b, { direction }) => {
        const field = `extra.post@content.ok`;
        if (direction === 'descend') {
          return _.get(a, field, 0) > _.get(b, field, 0) ? -1 : 1;
        } else {
          return _.get(a, field, 0) > _.get(b, field, 0) ? 1 : -1;
        }
      }
    },
    render: ({ record }) => (
      <div>
        {LOG_CONFIG.map((log) => (
          <div class="flex items-center">
            <span class="text-10 mr-4">{log.title}</span>
            <span class="color-green">{_.get(record, `extra.${log.url}.ok`, 0)}</span>/
            <span class="color-red">{_.get(record, `extra.${log.url}.fail`, 0)}</span>
          </div>
        ))}
      </div>
    )
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

function addRuleFile() {
  fileInputRef.value.click();
}

function addRuleUrl() {
  const modal = Modal.open({
    draggable: true,
    mask: true,
    width: 400,
    footer: false,
    title: '导入规则',
    content: (
      <ImportRules
        onDone={(count = 0) => {
          rulesStore.sync();
          Message.success({
            content: `导入${count}条数据`,
            closable: true,
            resetOnHover: true
          });
          modal.close();
        }}
      />
    )
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

// 表格数据发生变化时触发
async function handleChange(data, extra, currentData) {
  console.log('[handleChange]', { data, extra, currentData });
  const { type } = extra;
  if (type !== 'drag') return;
  loading.value = true;
  const ids = currentData.map((e) => e.raw.id);
  await updateRuleSort({ id: ids }).catch(() => {});
  await rulesStore.sync();
  loading.value = false;
}

const { drop, dropFile } = useDropRules(({ count }) => {
  Message.success({
    content: `导入${count}条数据`,
    closable: true,
    resetOnHover: true
  });
});

async function changeFile(e) {
  const files = e.target.files;
  for (const file of files) {
    await dropFile(file);
  }
}

const { copy } = useClipboard();

function getSelectedRuleStr() {
  const rules = selectedKeys.value
    .map((id) => {
      const rule = rulesStore.list.find((e) => e.id === id);
      if (!rule) return;
      try {
        return encodeRule(rule);
      } catch (error) {
        console.error(error);
      }
    })
    .filter((e) => e);
  return JSON.stringify(rules);
}

function copySelected() {
  copy(getSelectedRuleStr())
    .then(() => {
      Message.success({
        content: `已复制到剪贴板`,
        closable: true,
        resetOnHover: true
      });
    })
    .catch(() => {
      Message.success({
        content: `复制失败`,
        closable: true,
        resetOnHover: true
      });
    });
}

function exportSelected() {
  const blob = new Blob([getSelectedRuleStr()], {
    type: 'application/json'
  });
  saveAs(blob, 'rules.json');
}
</script>

<template>
  <div class="px-10 py-10 h-full flex flex-col">
    <div class="mb-10 flex gap-10">
      <div class="flex-1 flex items-center gap-10">
        <a-input-search v-model="searchText" placeholder="搜索" class="!w-80" />
        <a-checkbox-group v-model="contentTypes">
          <a-checkbox v-for="item in CONTENT_TYPES" :key="item.value" :value="item.value">
            {{ item.label }}
          </a-checkbox>
        </a-checkbox-group>
      </div>
      <a-button @click="editBookSource">打开规则文件</a-button>
      <a-button type="primary" @click="addRule">
        <template #icon>
          <icon-plus />
        </template>
        添加规则
      </a-button>
    </div>
    <div class="flex-1 overflow-hidden">
      <a-table
        :columns="tableColumns"
        :data="tableData"
        :pagination="false"
        :scrollbar="true"
        :scroll="{
          y: '100%'
        }"
      />
    </div>
  </div>
</template>

<script setup lang="jsx">
import { CONTENT_TYPES } from '@/constants';
import { postMessage, useMessage } from '@/utils/postMessage';

const router = useRouter();

const searchText = ref('');
const contentTypes = ref(CONTENT_TYPES.map((e) => e.value).flat());

function updateRule(row) {
  postMessage('updateRule', row);
}

function editRule(row) {
  router.push({
    path: '/rule-info',
    query: {
      id: row.id
    }
  });
}
const rules = ref([]);

const tableColumns = ref([
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '域名',
    dataIndex: 'host'
  },
  {
    title: '作者',
    dataIndex: 'author'
  },
  {
    title: '启用搜索',
    width: 100,
    align: 'center',
    render: ({ record }) => (
      <a-switch
        model-value={record.enableSearch}
        onUpdate:model-value={(v) =>
          updateRule({
            ...record,
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
    render: ({ record }) => (
      <a-switch
        model-value={record.enableDiscover}
        onUpdate:model-value={(v) =>
          updateRule({
            ...record,
            enableDiscover: v
          })
        }
      />
    )
  },
  {
    title: '操作',
    width: 100,
    align: 'center',
    fixed: 'right',
    render: ({ record }) => (
      <a-button type="primary" shape="circle" onClick={() => editRule(record)}>
        <icon-edit />
      </a-button>
    )
  }
]);

const tableData = computed(() => {
  if (!searchText.value) return rules.value.filter((e) => contentTypes.value.includes(e.contentType));
  return rules.value.filter((e) => e.name?.includes(searchText.value) && contentTypes.value.includes(e.contentType));
});

// 添加规则
function addRule() {
  router.push('/rule-info');
}

useMessage('getBookSource', (data) => {
  rules.value = data;
});

postMessage('getBookSource', {});

function editBookSource() {
  postMessage('editBookSource', {});
}
</script>

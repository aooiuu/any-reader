<template>
  <div class="relative h-full flex flex-col bg-[--ar-main-background] px-10 py-10 text-[--ar-color-text]">
    <a-alert
      v-if="IS_VSCODE"
      class="mb-10"
      message="VSCode 插件修改规则后仅对当前的标签页生效, 其它标签页需要重启 VSCode 或重新打开标签页才会生效, 建议使用桌面端编辑规则"
      type="warning"
      closable
    />

    <div class="mb-10 flex gap-10">
      <div class="flex flex-1 items-center gap-10">
        <a-input-search v-model:value="searchText" placeholder="搜索" class="!w-140px" />
        <a-checkbox-group v-model:value="contentTypes" :options="CONTENT_TYPES"> </a-checkbox-group>
      </div>
    </div>
    <input ref="fileInputRef" type="file" class="hidden" @change="changeFile" />
    <div class="mb-10 flex gap-10 text-14">
      <a-dropdown>
        <a-button type="primary">
          添加规则
          <PlusOutlined />
        </a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="addRuleFile">从文件导入</a-menu-item>
            <a-menu-divider />
            <a-menu-item @click="addRuleUrl">从文本导入</a-menu-item>
            <a-menu-item @click="addRuleUrl">从URL导入</a-menu-item>
            <a-menu-divider />
            <a-menu-item @click="addRule">单个添加</a-menu-item>
            <a-menu-divider />
            <a-menu-item @click="addCMS">从资源站添加</a-menu-item>
            <a-menu-item @click="addRuleFile">从ZyPlayer导入</a-menu-item>
            <a-menu-divider />
          </a-menu>
        </template>
      </a-dropdown>
      <a-button shape="circle" type="primary" :loading="loading" @click="getRules">
        <template #icon>
          <ReloadOutlined></ReloadOutlined>
        </template>
      </a-button>

      <div class="flex-1 overflow-hidden"></div>
      <a-dropdown>
        <a-button>
          测速
          <DownOutlined />
        </a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="pingAll">测速</a-menu-item>
            <a-menu-item class="!text-red" @click="delTimeoutRules">一键删除超时规则</a-menu-item>
            <a-menu-divider />
          </a-menu>
        </template>
      </a-dropdown>

      <a-dropdown position="bottom" :disabled="!selectedKeys.length">
        <a-button type="primary" :disabled="!selectedKeys.length">批量操作<DownOutlined /></a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="batchUpdate({ enableSearch: false })">禁用选中搜索</a-menu-item>
            <a-menu-item @click="batchUpdate({ enableDiscover: false })">禁用选中发现</a-menu-item>
            <a-menu-divider />
            <a-menu-item @click="batchUpdate({ enableSearch: true })">启用选中搜索</a-menu-item>
            <a-menu-item @click="batchUpdate({ enableDiscover: true })">启用选中发现</a-menu-item>
            <a-menu-divider />
            <a-menu-item @click="delSelected">删除选中</a-menu-item>
            <a-menu-divider />
            <a-menu-item @click="copySelected">复制选中</a-menu-item>
            <a-menu-item @click="exportSelected">导出选中</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <div ref="tableWarpRef" class="flex-1 overflow-hidden" @drop="drop" @dragover.prevent @dragenter.prevent>
      <a-table
        row-key="id"
        :loading="loading || loading2"
        :pagination="{
          defaultPageSize: 10,
          showTotal: (total: number) => `总数: ${total}`
        }"
        :scroll="{
          y: height - 120
        }"
        :row-selection="{ selectedRowKeys: selectedKeys, onChange: (v: any) => (selectedKeys = v as string[]) }"
        :columns="tableColumns"
        :data-source="tableData"
        :scrollbar="true"
        empty-text="没有规则, 你可以拖拽规则 JSON 文件到这里导入"
      >
        <template #emptyText>
          <div class="h-80 flex items-center justify-center">没有规则, 你可以拖拽规则 JSON 文件到这里导入</div>
        </template>
      </a-table>
    </div>

    <!-- 规则编辑 -->
    <a-drawer v-model:open="ruleInfoVisible" width="100%" title="编辑规则" placement="right" :get-container="false" :closable="false">
      <RuleInfo v-if="ruleInfoVisible" :rule-id="ruleId" @close="ruleInfoVisible = false" />
    </a-drawer>
  </div>
</template>

<script setup lang="tsx">
import { App } from 'ant-design-vue';
import type { ColumnsType } from 'ant-design-vue/es/table/Table';
import _ from 'lodash-es';
import { encodeRule, type Rule } from '@any-reader/rule-utils';
import { useClipboard, useElementSize } from '@vueuse/core';
import { saveAs } from 'file-saver';
import { CONTENT_TYPES, IS_VSCODE } from '@/constants';
import { useRulesStore } from '@/stores/rules';
import { ping, batchUpdateRules, delRules } from '@/api';
import { timeoutWith } from '@/utils/promise';
import { useDropRules } from '@/hooks/useDropRules';
import ImportRules from './ImportRules.vue';
import ImportCMS from './ImportCMS.vue';
import RuleInfo from '@/pages/pc/rule-info/index.vue';

const { modal, message } = App.useApp();

const tableWarpRef = ref();
const { height } = useElementSize(tableWarpRef);

const router = useRouter();
const rulesStore = useRulesStore();
const pingIds = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);
const loading = ref(false);
const fileInputRef = ref();

// 规则编辑
const ruleInfoVisible = ref(false);
const ruleId = ref('');

async function getRules() {
  loading.value = true;
  await rulesStore.sync();
  loading.value = false;
}

const searchText = ref('');
const contentTypes = ref(CONTENT_TYPES.map((e) => e.value).flat());

function editRule(row: Rule) {
  ruleId.value = row.id;
  ruleInfoVisible.value = true;
}

function sortableValue(obj: any, path: string) {
  return _.get(obj, path) || Number.MAX_SAFE_INTEGER;
}

// const LOG_CONFIG = [
//   { url: 'post@searchByRuleId', title: '搜索' },
//   { url: 'get@discoverMap', title: '发现分类' },
//   { url: 'post@discover', title: '发现列表' },
//   { url: 'post@getChapter', title: '章节列表' },
//   { url: 'post@content', title: '内容' }
// ];

const tableColumns = ref<ColumnsType<any>>([
  {
    title: '名称',
    dataIndex: 'name',
    align: 'center',
    width: 100,
    ellipsis: true,
    fixed: 'left',
    sortDirections: ['ascend', 'descend']
  },
  {
    title: '域名',
    dataIndex: 'host',
    ellipsis: true,
    sortDirections: ['ascend', 'descend'],
    customRender: ({ record }) => {
      return (
        <a-button
          type="link"
          onClick={() => {
            window.open(record.host);
          }}>
          {record.host}
        </a-button>
      );
    }
  },
  {
    title: '启用搜索',
    width: 120,
    align: 'center',
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
    filterMultiple: false,
    onFilter: (value, record) => value === record.enableSearch,
    customRender: ({ record }) => (
      <a-switch
        checked={record.enableSearch}
        onUpdate:checked={(v: boolean) =>
          rulesStore.updateRuleById(record.id, {
            enableSearch: v
          })
        }
      />
    )
  },
  {
    title: '启用发现',
    width: 120,
    align: 'center',
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
    filterMultiple: false,
    onFilter: (value, record) => value === record.enableDiscover,
    customRender: ({ record }) => (
      <a-switch
        checked={record.enableDiscover}
        onUpdate:checked={(v: boolean) =>
          rulesStore.updateRuleById(record.id, {
            enableDiscover: v
          })
        }
      />
    )
  },
  {
    title: '置顶',
    width: 120,
    align: 'center',
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
    customRender: ({ record }) => <a-switch checked={rulesStore.pindStore.includes(record.id)} onUpdate:checked={() => rulesStore.pindRule(record)} />
  },
  {
    title: '作者',
    dataIndex: 'author',
    align: 'center',
    width: 100,
    ellipsis: true,
    sortDirections: ['ascend', 'descend']
  },
  {
    title: '延迟',
    dataIndex: 'extra.ping',
    width: 90,
    align: 'center',
    customRender: ({ record }) => {
      const extra = record.extra;
      return (
        <a-button
          class={extra?.ping === -1 ? '!text-red' : ''}
          type="text"
          onClick={async () => {
            const res = await ping(_.pick(record, ['id', 'host'])).catch(() => {});
            if (res?.code === 0 && res.data) {
              record.extra.ping = res.data.ping;
            }
          }}>
          {pingIds.value.includes(record.id) ? '-' : extra?.ping === -1 ? '超时' : extra?.ping || '测速'}
        </a-button>
      );
    },
    sortDirections: ['ascend', 'descend'],
    sorter: (a, b) => {
      return sortableValue(a, 'extra.ping') - sortableValue(b, 'extra.ping');
    }
  },
  // {
  //   title: '接口调用',
  //   width: 160,
  //   align: 'center',
  //   filters: LOG_CONFIG.map((log) => ({
  //     text: log.title + '失败>3且成功=0',
  //     value: log.url
  //   })),
  //   filterMultiple: false,
  //   onFilter: (value, record) => {
  //     const ok = _.get(record, `extra.${value}.ok`, 0);
  //     const fail = _.get(record, `extra.${value}.fail`, 0);
  //     return ok === 0 && fail > 3;
  //   },
  //   sortDirections: ['ascend', 'descend'],
  //   sorter: (a, b, { direction }) => {
  //     const field = `extra.post@content.ok`;
  //     if (direction === 'descend') {
  //       return _.get(a, field, 0) > _.get(b, field, 0) ? -1 : 1;
  //     } else {
  //       return _.get(a, field, 0) > _.get(b, field, 0) ? 1 : -1;
  //     }
  //   },
  //   customRender: ({ record }) => (
  //     <div>
  //       {LOG_CONFIG.map((log) => (
  //         <div class="flex items-center text-10">
  //           <span class="mr-4">{log.title}</span>
  //           <span class="color-green">{_.get(record, `extra.${log.url}.ok`, 0)}</span>/
  //           <span class="color-red">{_.get(record, `extra.${log.url}.fail`, 0)}</span>
  //         </div>
  //       ))}
  //     </div>
  //   )
  // },
  {
    title: '操作',
    width: 120,
    align: 'center',
    fixed: 'right',
    customRender: ({ record }) => (
      <div class="flex gap-5 text-12">
        <a-button size="small" type="text" onClick={() => editRule(record)}>
          编辑
        </a-button>
        <a-button size="small" type="text" danger onClick={() => delRule(record.id)}>
          删除
        </a-button>
      </div>
    )
  }
]);

const tableData = computed(() => {
  if (!searchText.value) return rulesStore.list.filter((e) => contentTypes.value.includes(e.contentType));
  return rulesStore.list.filter((e) => e.name?.includes(searchText.value) && contentTypes.value.includes(e.contentType));
});

// 添加规则
function addRule() {
  router.push({
    name: 'ruleInfo'
  });
}

// 从文件导入
function addRuleFile() {
  fileInputRef.value.click();
}

function addRuleUrl() {
  const m = modal.confirm({
    mask: true,
    closable: true,
    width: 400,
    footer: false,
    title: '导入规则',
    content: (
      <ImportRules
        onDone={(count = 0) => {
          rulesStore.sync();
          message.success({
            content: `导入${count}条数据`
          });
          m.destroy();
        }}
      />
    )
  });
}

// 从资源站添加
function addCMS() {
  const m = modal.confirm({
    mask: true,
    closable: true,
    width: 600,
    footer: false,
    title: '从资源站添加',
    content: (
      <ImportCMS
        onDone={(count = 0) => {
          rulesStore.sync();
          message.success({
            content: `导入${count}条数据`
          });
          m.destroy();
        }}
      />
    )
  });
}

async function pingAll() {
  const chunks: any[][] = _.chunk(tableData.value, 5);
  for (const rules of chunks) {
    pingIds.value = rules.map((e) => e.id);
    await timeoutWith(
      Promise.all(
        rules.map((rule) =>
          ping(_.pick(rule, ['id', 'host']))
            .then((res) => {
              if (res.code === 0 && res.data) {
                rule.extra.ping = res.data.ping;
              }
            })
            .catch(() => {})
        )
      ),
      3000
    ).catch(() => {});
    pingIds.value = [];
  }
}

async function batchUpdate(rule: Partial<Rule>) {
  await batchUpdateRules({
    ids: [...selectedKeys.value],
    rule
  });
  rulesStore.sync();
}

// 删除规则
function delRule(id: string[]) {
  modal.confirm({
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
        const { extra } = rule;
        if (!extra) return false;
        if (extra.ping === -1) return true;
        return false;
      })
      .map((e) => e.id)
  );
}

// async function onDrag() {
//   loading.value = true;
//   const ids = rulesStore.list.map((e) => e.id);
//   await updateRuleSort({ id: ids }).catch(() => {});
//   await rulesStore.sync();
//   loading.value = false;
// }

// TODO: 拖拽排序
// let dragStartId = '';
// function customRow(record: any, state: any[]) {
//   return {
//     draggable: true,
//     style: { cursor: 'move' },
//     onDragstart: (ev: DragEvent) => {
//       ev.dataTransfer!.effectAllowed = 'move';
//       dragStartId = record.id;
//     },
//     onDragenter: (ev: DragEvent) => {
//       const target = ev.target as HTMLElement;
//       const nodes = target.parentNode!.childNodes as unknown as HTMLElement[];
//       nodes.forEach((item) => {
//         if (!item.style) return;
//         item.style.borderTop = '2px dashed #1890ff';
//       });
//     },
//     onDragleave: (ev: DragEvent) => {
//       const target = ev.target as HTMLElement;
//       const nodes = target.parentNode!.childNodes as unknown as HTMLElement[];
//       nodes.forEach((item) => {
//         if (!item.style) return;
//         item.style.borderTop = '';
//       });
//     },
//     onDrop: (ev: DragEvent) => {
//       ev.preventDefault();
//       ev.stopPropagation();
//       const files = ev.dataTransfer?.files || [];
//       if (files.length) {
//         for (const file of files) {
//           dropFile(file);
//         }
//         return;
//       }

//       const target = ev.target as HTMLElement;
//       const dropCol = target.tagName !== 'TR' ? target.parentNode : target;
//       const dropId = record.id;
//       const dragIndex = state.findIndex((item) => item.id === dragStartId);
//       const dropIndex = state.findIndex((item) => item.id === dropId);
//       const data = [...state];
//       const item = data.splice(dragIndex, 1); // 移除拖动前的元素
//       data.splice(dropIndex, 0, item[0]); // 将拖动元素插入到新的位置
//       rulesStore.list = data;
//       onDrag();
//       dropCol!.childNodes.forEach((item: any) => {
//         if (!item.style) return;
//         item.style.borderTop = '';
//       });
//     },
//     onDragOver: (ev: DragEvent) => ev.preventDefault()
//   };
// }

const {
  drop,
  dropFile,
  loading: loading2
} = useDropRules(({ count }) => {
  message.success({
    content: `导入${count}条数据`
  });
});

async function changeFile(e: Event) {
  const files = (e.target as HTMLInputElement)!.files;
  if (!files || !files.length) return;
  loading.value = true;
  for (const file of files) {
    await dropFile(file).catch(() => {});
  }
  loading.value = false;
}

const { copy } = useClipboard();

function getSelectedRuleStr() {
  const rules = selectedKeys.value
    .map((id) => {
      const rule = rulesStore.list.find((e) => e.id === id);
      if (!rule) return;
      try {
        return encodeRule(_.omit(rule, ['extra']));
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
      message.success({
        content: `已复制到剪贴板`
      });
    })
    .catch(() => {
      message.success({
        content: `复制失败`
      });
    });
}

function exportSelected() {
  const blob = new Blob([getSelectedRuleStr()], {
    type: 'application/json'
  });
  saveAs(blob, 'rules.json');
}

onMounted(() => {
  getRules();
});
</script>

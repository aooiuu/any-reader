<template>
  <div class="w-full h-full">
    <div v-if="loading" class="w-full h-full flex items-center justify-center">
      <a-spin />
    </div>
    <div v-else class="px-10 py-10 h-full flex flex-col overflow-hidden">
      <div class="flex-1 overflow-hidden flex flex-col">
        <div class="mb-10">
          <a-radio-group v-model:value="formType" type="button">
            <a-radio-button value="All">双栏</a-radio-button>
            <a-radio-button value="Form">Form</a-radio-button>
            <a-radio-button value="JSON">JSON</a-radio-button>
          </a-radio-group>
        </div>

        <div class="flex-1 flex overflow-hidden">
          <AForm
            v-if="formType === 'All' || formType === 'Form'"
            :model="formData"
            :auto-label-width="true"
            class="flex-1 overflow-auto"
            layout="vertical"
          >
            <a-radio-group v-model:value="formStep" type="button" direction="vertical" class="mb-10 mx-10">
              <a-radio-button :value="1">基础信息</a-radio-button>
              <a-radio-button :value="2">搜索</a-radio-button>
              <a-radio-button :value="3">章节列表</a-radio-button>
              <a-radio-button :value="4">内容</a-radio-button>
              <a-radio-button :value="5">发现页</a-radio-button>
            </a-radio-group>

            <template v-for="item in formItems" :key="item.prop">
              <AFormItem v-if="item.formStep === formStep && (!item.show || item.show(formData))">
                <template #label>
                  <span>{{ item.label }}</span>
                  <span class="op-70 ml-10 text-12">{{ item.prop }}</span>
                </template>
                <template v-if="item.type === 'select'">
                  <a-select v-model:value="formData[item.prop]">
                    <a-select-option v-for="o in item.options" :key="o.value" :value="o.value">{{ o.label }}</a-select-option>
                  </a-select>
                </template>
                <template v-else-if="item.type === 'number'">
                  <a-input-number v-model:value="formData[item.prop]" :min="0" :placeholder="item.prop" />
                </template>
                <template v-else-if="item.type === 'textarea'">
                  <a-textarea
                    v-model:value="formData[item.prop]"
                    :placeholder="item.prop"
                    :auto-size="{
                      minRows: 2,
                      maxRows: 5
                    }"
                  />
                </template>
                <template v-else-if="item.type === 'switch'">
                  <a-switch v-model:value="formData[item.prop]" :checked-value="true" :unchecked-value="false" :placeholder="item.prop" />
                </template>
                <template v-else>
                  <a-input v-model:value="formData[item.prop]" :placeholder="item.prop" />
                </template>
              </AFormItem>
            </template>
          </AForm>

          <div v-if="formType === 'All' || formType === 'JSON'" class="flex-1 overflow-auto">
            <MonacoEditor :model-value="formDataText" @update:model-value="setFormData" />
          </div>
        </div>
      </div>

      <div class="flex mt-10 justify-end gap-5">
        <a-button @click="router.back">返回</a-button>
        <a-button type="primary" @click="submit">确定</a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CONTENT_TYPES, CONTENT_TYPE } from '@/constants';
import { getRuleById, createRule } from '@/api';
import MonacoEditor from './MonacoEditor.vue';

const loading = ref(false);

const router = useRouter();
const route = useRoute();

const formType = ref('All');
const formStep = ref(1);

const formData = reactive({
  id: '',
  enableUpload: '',
  author: '',
  postScript: '',
  name: '',
  host: '',
  group: '',
  contentType: CONTENT_TYPE.NOVEL,
  sort: '',
  useCryptoJS: '',
  loadJs: '',
  userAgent: '',
  enableDiscover: '',
  discoverUrl: '',
  discoverNextUrl: '',
  discoverItems: '',
  discoverList: '',
  discoverTags: '',
  discoverName: '',
  discoverCover: '',
  discoverAuthor: '',
  discoverChapter: '',
  discoverDescription: '',
  discoverResult: '',
  enableSearch: '',
  searchUrl: '',
  searchNextUrl: '',
  searchItems: '',
  searchList: '',
  searchTags: '',
  searchName: '',
  searchCover: '',
  searchAuthor: '',
  searchChapter: '',
  searchDescription: '',
  searchResult: '',
  enableMultiRoads: '',
  chapterRoads: '',
  chapterRoadName: '',
  chapterUrl: '',
  chapterNextUrl: '',
  chapterItems: '',
  chapterList: '',
  chapterName: '',
  chapterCover: '',
  chapterLock: '',
  chapterTime: '',
  chapterResult: '',
  contentUrl: '',
  contentNextUrl: '',
  contentItems: '',
  loginUrl: '',
  cookies: '',
  viewStyle: ''
});

const formItems = computed(() => {
  return [
    { prop: 'id', label: 'uuid', show: () => false },
    { prop: 'name', label: '名称', formStep: 1 },
    {
      prop: 'contentType',
      label: '类型',
      type: 'select',
      formStep: 1,
      options: CONTENT_TYPES.filter((v) => [CONTENT_TYPE.GAME, CONTENT_TYPE.MANGA, CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO].includes(v.value))
    },
    { prop: 'host', label: '域名', formStep: 1 },
    { prop: 'sort', label: '排序', formStep: 1, type: 'number' },
    { prop: 'loadJs', label: '全局JS脚本', formStep: 1, type: 'textarea' },
    // { prop: 'cookies', label: 'cookies', formStep: 1 },

    {
      prop: 'enableSearch',
      label: '是否启用',
      type: 'switch',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 2
    },
    {
      prop: 'searchUrl',
      label: '搜索地址',
      type: 'textarea',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 2
    },
    {
      prop: 'searchList',
      label: '搜索列表',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 2
    },
    {
      prop: 'searchCover',
      label: '封面',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 2
    },
    {
      prop: 'searchName',
      label: '标题',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 2
    },
    {
      prop: 'searchAuthor',
      label: '作者',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 2
    },
    {
      prop: 'searchChapter',
      label: '章节',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 2
    },
    {
      prop: 'searchDescription',
      label: '描述',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 2
    },
    {
      prop: 'searchResult',
      label: '搜索结果',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 2
    },

    {
      prop: 'chapterUrl',
      label: '章节地址',
      type: 'textarea',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 3
    },
    {
      prop: 'chapterName',
      label: '标题',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 3
    },
    {
      prop: 'chapterList',
      label: '列表',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 3
    },
    {
      prop: 'chapterCover',
      label: '封面',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 3
    },
    {
      prop: 'chapterTime',
      label: '时间',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 3
    },
    {
      prop: 'chapterResult',
      label: '结果',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 3
    },

    {
      prop: 'contentItems',
      label: '内容',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 4
    },

    {
      prop: 'enableDiscover',
      label: '是否启用',
      type: 'switch',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 5
    },
    {
      prop: 'discoverUrl',
      label: '请求地址',
      type: 'textarea',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 5
    },
    {
      prop: 'discoverList',
      label: '列表',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 5
    },
    {
      prop: 'discoverName',
      label: '标题',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 5
    },
    {
      prop: 'discoverCover',
      label: '封面',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 5
    },
    {
      prop: 'discoverAuthor',
      label: '作者',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 5
    },
    {
      prop: 'discoverDescription',
      label: '描述',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 5
    },
    {
      prop: 'discoverResult',
      label: '结果',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 5
    },
    {
      prop: 'discoverItems',
      label: '内容',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 5
    },
    {
      prop: 'discoverTags',
      label: '标签',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 5
    },
    {
      prop: 'discoverChapter',
      label: '章节',
      show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType),
      formStep: 5
    }
  ];
});

// 规则字符串
const formDataText = computed(() => JSON.stringify(formData, null, 4));

// 更新规则
function setFormData(v) {
  const json = JSON.parse(v);
  Object.keys(formData).forEach((k) => {
    formData[k] = json[k];
  });
}

async function submit() {
  await createRule({
    ...formData
  });
  router.back();
}

onMounted(async () => {
  if (route.query.id) {
    loading.value = true;
    const res = await getRuleById(route.query.id);
    if (res.code === 0) {
      Object.assign(formData, res.data);
    }
    loading.value = false;
  }
});
</script>

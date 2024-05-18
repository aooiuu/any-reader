<template>
  <a-spin class="w-full h-full" :loading="loading">
    <div class="px-10 py-10 h-full flex flex-col overflow-hidden">
      <div class="flex-1 overflow-hidden flex flex-col">
        <div class="mb-10">
          <a-radio-group v-model="formType" type="button">
            <a-radio value="All">双栏</a-radio>
            <a-radio value="Form">Form</a-radio>
            <a-radio value="JSON">JSON</a-radio>
          </a-radio-group>
        </div>

        <div class="flex-1 flex overflow-hidden">
          <AForm v-if="formType === 'All' || formType === 'Form'" :model="formData" :auto-label-width="true" class="flex-1 overflow-auto">
            <template v-for="item in formItems" :key="item.prop">
              <AFormItem v-if="!item.show || item.show(formData)" :label="item.label">
                <template v-if="item.type === 'select'">
                  <a-select v-model="formData[item.prop]">
                    <a-option v-for="o in item.options" :key="o.value" :value="o.value">{{ o.label }}</a-option>
                  </a-select>
                </template>
                <template v-else>
                  <AInput v-model="formData[item.prop]" :placeholder="item.prop" />
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
  </a-spin>
</template>

<script setup>
import { v4 as uuidV4 } from 'uuid';
import { CONTENT_TYPES, CONTENT_TYPE } from '@/constants';
import { getRuleById, createRule } from '@/api';
import MonacoEditor from './MonacoEditor.vue';

const loading = ref(false);

const router = useRouter();
const route = useRoute();

const formType = ref('All');

const formItems = [
  { prop: 'id', label: 'uuid', show: () => false },
  { prop: 'name', label: '名称' },
  {
    prop: 'contentType',
    label: '类型',
    type: 'select',
    options: CONTENT_TYPES.filter((v) => [CONTENT_TYPE.GAME, CONTENT_TYPE.MANGA, CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO].includes(v.value))
  },
  { prop: 'host', label: '域名' },
  { prop: 'searchUrl', label: '搜索地址', show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType) },
  { prop: 'searchList', label: '搜索列表', show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType) },
  { prop: 'searchCover', label: '封面', show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType) },
  { prop: 'searchName', label: '标题', show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType) },
  { prop: 'searchAuthor', label: '作者', show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType) },
  { prop: 'searchChapter', label: '章节', show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType) },
  {
    prop: 'searchDescription',
    label: '描述',
    show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType)
  },
  {
    prop: 'searchResult',
    label: '搜索结果',
    show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType)
  },
  { prop: 'chapterUrl', label: '章节地址', show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType) },
  { prop: 'chapterName', label: '标题', show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType) },
  { prop: 'chapterList', label: '列表', show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType) },
  { prop: 'chapterCover', label: '封面', show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType) },
  { prop: 'chapterTime', label: '时间', show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType) },
  { prop: 'chapterResult', label: '结果', show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType) },
  { prop: 'contentItems', label: '内容', show: (item) => [CONTENT_TYPE.NOVEL, CONTENT_TYPE.VIDEO, CONTENT_TYPE.MANGA].includes(item.contentType) }
  // { prop: 'sort', label: '排序' }
  // { prop: 'cookies', label: '' }
];

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
    ...formData,
    uuid: uuidV4()
  });
  router.push('/rules');
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

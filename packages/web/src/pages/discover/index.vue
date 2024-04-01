<template>
  <div class="px-10 py-10 h-full flex overflow-hidden">
    <div class="flex flex-col h-full w-120 overflow-hidden">
      <a-select v-model="contentType" class="mb-10">
        <a-option v-for="o in CONTENT_TYPES" :key="o.value" :value="o.value">{{ o.label }}</a-option>
      </a-select>
      <div class="flex-1 overflow-auto">
        <div
          v-for="r in ruleListDisplay"
          :key="r.id"
          :class="['h-40 lh-40 mb-2 px-12 cursor-pointer hover:op-70', ruleId === r.id ? 'bg-[#ffffff0a]' : '']"
          @click="changeRule(r)"
        >
          {{ r.name }}
        </div>
      </div>
    </div>

    <div class="h-full flex flex-col flex-1 ml-5 overflow-hidden">
      <Category :list="categoryList" @change="changeCategory" />
      <a-spin class="w-full h-full" :loading="loading">
        <div v-if="list.length" class="mt-10 flex-1 overflow-auto">
          <div class="flex overflow-auto flex-wrap gap-6">
            <div v-for="(row, idx) in list" :key="idx" class="flex flex-col flex-shrink-0 w-102 cursor-pointer hover:op-70" @click="getChapter(row)">
              <a-image :src="row.cover" :preview="false" alt="" srcset="" class="w-102 h-136 mb-5 rounded-5" />
              <div class="overflow-hidden whitespace-nowrap text-ellipsis mb-2">{{ row.name }}</div>
              <div class="overflow-hidden whitespace-nowrap text-ellipsis text-12 op-70">{{ row.author }}</div>
            </div>
          </div>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script setup>
import { CONTENT_TYPES, CONTENT_TYPE } from '@/constants';
import { postMessage, useMessage, sendMessage } from '@/utils/postMessage';
import Category from './Category.vue';

const list = ref([]);
const contentType = ref(CONTENT_TYPE.NOVEL);
const ruleList = ref([]);
const ruleListDisplay = computed(() => ruleList.value.filter((e) => e.enableDiscover && e.contentType === contentType.value));
const ruleId = ref('');
const rule = ref({});
const categoryList = ref([]);
const loading = ref(false);

// 分类被修改
async function changeCategory(row) {
  loading.value = true;
  list.value = [];
  loading.value = true;
  list.value = await sendMessage('discover', {
    data: row,
    rule: rule.value
  }).then((e) => e.data);
  loading.value = false;
}

// 规则被修改
async function changeRule(row) {
  loading.value = true;
  ruleId.value = row.id;
  rule.value = row;
  list.value = [];
  categoryList.value = [];
  categoryList.value = await sendMessage('discoverMap', {
    rule: row
  }).then((e) => e.data);
  loading.value = false;
}

// 获取规则列表
useMessage('getBookSource', (data) => {
  ruleList.value = data;
  if (data.length > 0) {
    changeRule(data[0]);
  }
});

postMessage('getBookSource', {});

function getChapter(row) {
  postMessage('getChapter', {
    rule: rule.value,
    data: row
  });
}
</script>

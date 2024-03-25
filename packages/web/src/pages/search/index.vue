<template>
  <div class="px-10 py-10 h-full flex flex-col">
    <div class="mb-10 flex gap-10">
      <div class="flex-1 flex items-center gap-10">
        <a-input-search v-model="searchText" placeholder="输入关键词，回车键搜索" class="!w-80" :disabled="loading" @keyup.enter="onSearch" />
        <a-checkbox-group v-model="contentTypes" :disabled="loading">
          <a-checkbox v-for="item in CONTENT_TYPES" :key="item.value" :value="item.value">
            {{ item.label }}
          </a-checkbox>
        </a-checkbox-group>
      </div>
    </div>
    <!-- 搜索进度 -->
    <div v-if="loading" class="flex items-center">
      <a-button class="mr-5" @click="cancelSearch">取消</a-button>
      <ASpin />
      <div v-if="runCount > 0" class="ml-2">搜索进度: {{ runCount }}/{{ total }} {{ ((runCount / total) * 100).toFixed(0) }}%</div>
    </div>
    <div class="flex-1 overflow-auto">
      <!-- 规则列表 -->
      <template v-for="item in list" :key="item.id">
        <div v-if="item.list.length" class="pt-20">
          <div class="mb-6">{{ item.rule.name }}</div>
          <div class="overflow-hidden">
            <div class="flex overflow-auto gap-5 pb-5">
              <div
                v-for="(row, idx) in item.list"
                :key="idx"
                class="flex flex-col flex-shrink-0 w-102 cursor-pointer hover:op-70"
                @click="getChapter(row, item.rule)"
              >
                <a-image :src="row.cover" :preview="false" alt="" srcset="" class="w-102 h-136 mb-5 rounded-5" />
                <div class="overflow-hidden whitespace-nowrap text-ellipsis mb-2">{{ row.name }}</div>
                <div class="overflow-hidden whitespace-nowrap text-ellipsis text-12 op-70">{{ row.author }}</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { v4 as uuidV4 } from 'uuid';
import { CONTENT_TYPES } from '@/constants';
import { postMessage, useMessage } from '@/utils/postMessage';

let uuid: string = '';
const searchText = ref('');
const contentTypes = ref(CONTENT_TYPES.map((e) => e.value).flat());
const loading = ref(false);
const total = ref(0);
const runCount = ref(0);

const list = ref<any[]>([]);

function onSearch() {
  uuid = uuidV4();
  list.value = [];
  postMessage('search', {
    keyword: searchText.value,
    contentTypes: contentTypes.value,
    uuid
  });
  total.value = 0;
  runCount.value = 0;
  loading.value = true;
}

function cancelSearch() {
  uuid = uuidV4();
  loading.value = false;
}

useMessage('search', (data: any) => {
  console.log('[search]', data);
  if (!data || data.uuid !== uuid) return;
  if (data.count > 0) {
    list.value.push({
      rule: data.rule,
      list: data.list
    });
  }
  total.value = data.count;
  runCount.value = data.runCount;
  if (data.count === data.runCount) {
    loading.value = false;
  }
});

// 获取章节
function getChapter(row: any, rule: any) {
  postMessage('getChapter', {
    rule,
    data: row
  });
}
</script>

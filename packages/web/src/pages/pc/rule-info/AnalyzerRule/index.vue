<template>
  <div class="flex-1 overflow-hidden flex flex-col">
    <div class="flex item-center">
      <a-input v-model:value="keyword" class="flex-1 max-w-200" />
      <a-button class="ml-5" @click="search">搜索</a-button>
    </div>

    <div class="flex-1 overflow-auto my-20">
      <a-spin :spinning="loading" class="w-full">
        <div v-if="searchList.length">搜索结果:</div>
        <a-button v-for="item in searchList" :key="item.id" class="block" type="link" @click="chapterByRule(item)">
          {{ item.name }}
        </a-button>
        <div v-if="chapterList.length">章节列表:</div>
        <a-button v-for="item in chapterList" :key="item.id" class="block" type="link" @click="contentByRule(item)">
          {{ item.name }}
        </a-button>
        <div v-if="contentList.length">内容:</div>
        <div v-for="(item, idx) in contentList" :key="idx">{{ item }}</div>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Rule } from '@any-reader/rule-utils';
import { searchByRule, getChapterByRule, getContentByRule } from '@/api/modules/rule-manager';

const props = defineProps<{
  rule: Rule;
}>();

const keyword = ref<string>('');
const searchList = ref<any[]>([]);
const chapterList = ref<any[]>([]);
const contentList = ref<any[]>([]);
const loading = ref<boolean>(false);

async function search() {
  loading.value = true;
  searchList.value = [];
  chapterList.value = [];
  contentList.value = [];
  const res = await searchByRule({ rule: props.rule, keyword: keyword.value }).catch(() => {});
  loading.value = false;
  if (res?.code === 0) {
    searchList.value = res?.data || [];
  }
}

async function chapterByRule(data: any) {
  loading.value = true;
  chapterList.value = [];
  contentList.value = [];
  const res = await getChapterByRule({
    rule: props.rule,
    filePath: data.url
  }).catch(() => {});
  loading.value = false;
  if (res?.code === 0) {
    chapterList.value = res?.data || [];
  }
}

async function contentByRule(data: any) {
  loading.value = true;
  contentList.value = [];
  const res = await getContentByRule({
    rule: props.rule,
    chapterPath: data.url
  }).catch(() => {});
  loading.value = false;
  if (res?.code === 0) {
    contentList.value = res?.data || [];
  }
}
</script>

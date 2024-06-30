<template>
  <div class="h-full flex flex-col overflow-hidden">
    <van-tabs @click-tab="changeRule">
      <van-tab v-for="rule in ruleList" :key="rule.id" :name="rule.id" :title="rule.name"></van-tab>
    </van-tabs>

    <div class="mt-10">
      <ARCategoryM :list="categoryList" @change="changeCategory" />
    </div>

    <div class="mt-10 flex-1 overflow-auto">
      <div v-if="loading" class="flex-1 h-full flex justify-center items-center">
        <van-loading type="spinner" size="20" />
      </div>
      <div v-else-if="list.length" class="flex overflow-auto justify-center flex-wrap gap-6">
        <div
          v-for="(row, idx) in list"
          :key="idx"
          class="node relative flex flex-col flex-shrink-0 w-102 cursor-pointer hover:op-70"
          @click="
            emit('toChapter', {
              ruleId,
              name: row.name,
              filePath: row.url
            })
          "
        >
          <div class="w-102 h-136 mb-5 rounded-5 overflow-hidden">
            <ARCoverM :src="row.cover" :preview="false" alt="" srcset="" class="cover w-102 h-136" width="100%" height="100%" fit="cover" />
          </div>
          <div class="overflow-hidden whitespace-nowrap text-ellipsis mb-2">{{ row.name }}</div>
          <div class="overflow-hidden whitespace-nowrap text-ellipsis text-12 op-70">{{ row.author }}</div>
        </div>
        <div v-for="i in 10" :key="i" class="w-102 invisible" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRulesStore } from '@/stores/rules';
import { discoverMap, discover } from '@/api';

const props = defineProps({
  contentType: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['toChapter']);

const rulesStore = useRulesStore();

const categoryList = ref([]);
const list = ref([]);
const loading = ref(false);
const ruleList = ref([]);
let ruleId;

onMounted(() => {
  ruleList.value = rulesStore.list.filter((e) => e.contentType === props.contentType && e.enableDiscover);
  if (ruleList.value.length) changeRule({ name: ruleList.value[0].id });
});

// 规则被修改
async function changeRule({ name }) {
  const row = ruleList.value.find((e) => e.id === name);
  ruleId = row.id;
  loading.value = true;
  categoryList.value = [];
  const res = await discoverMap(row.id);
  categoryList.value = res?.data || [];
  loading.value = false;
}

// 分类被修改
async function changeCategory(row) {
  loading.value = true;
  list.value = [];
  loading.value = true;
  const res = await discover({
    data: JSON.parse(JSON.stringify(row)),
    ruleId
  });
  list.value = res?.data || [];
  loading.value = false;
}
</script>

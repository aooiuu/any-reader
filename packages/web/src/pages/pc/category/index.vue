<template>
  <ARRuleEmpty v-if="!rulesStore.list.length" />
  <div v-else class="flex flex-col md:flex-row h-full overflow-hidden text-[--ar-color-text] bg-[--ar-main-background]">
    <div class="flex flex-col md:h-full md:w-140 overflow-hidden bg-[--ar-left-bar-bg-secondary] p-10">
      <a-select v-if="typeof route.params.contentType === 'undefined'" v-model:value="contentType" class="mb-10">
        <a-select-option v-for="o in CONTENT_TYPES" :key="o.value" :value="o.value">{{ o.label }}</a-select-option>
      </a-select>
      <a-input v-model:value="searchText" class="mb-10" placeholder="过滤" />

      <!-- 分类 -->
      <ARTabs v-model="ruleId" :options="ruleListDisplay" value-key="id" label-key="name" @update:model-value="changeRule" />
    </div>

    <div class="h-full flex flex-col flex-1 ml-5 overflow-hidden pt-10 mr-10">
      <ARCategory :list="categoryList" @change="changeCategory" />
      <div v-if="loading" class="flex-1 flex items-center justify-center">
        <a-spin />
      </div>
      <div v-else-if="list.length" class="mt-10 flex-1 overflow-auto">
        <div class="flex overflow-auto justify-center flex-wrap gap-6">
          <div
            v-for="(row, idx) in list"
            :key="idx"
            class="node relative flex flex-col flex-shrink-0 w-102 cursor-pointer hover:op-70"
            @click="
              router.push({
                path: '/chapter',
                query: {
                  ...row,
                  ruleId,
                  name: row.name,
                  filePath: row.url
                }
              })
            "
          >
            <div class="w-102 h-136 mb-5 rounded-5 overflow-hidden">
              <ARCover :src="row.cover" :preview="false" alt="" srcset="" class="w-102 h-136" width="100%" height="100%" fit="cover" />
            </div>
            <div class="overflow-hidden whitespace-nowrap text-ellipsis mb-2">{{ row.name }}</div>
            <div class="overflow-hidden whitespace-nowrap text-ellipsis text-12 op-70">{{ row.author }}</div>

            <div
              class="star invisible absolute top-5 right-5 px-2 py-2 rounded-10 bg-[#000000cc] flex items-center justify-center"
              @click.stop="
                favoritesStore.star({
                  ...row,
                  ruleId
                })
              "
            >
              <StarFilled
                v-if="
                  favoritesStore.starred({
                    ...row,
                    ruleId
                  })
                "
                :size="14"
              />
              <StarOutlined v-else :size="14" />
            </div>
          </div>
          <div v-for="i in 10" :key="i" class="w-102 invisible" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { StarOutlined, StarFilled } from '@ant-design/icons-vue';
import { CONTENT_TYPES, CONTENT_TYPE } from '@/constants';
import { discover, discoverMap } from '@/api';
import { useFavoritesStore } from '@/stores/favorites';
import { useRulesStore } from '@/stores/rules';

const route = useRoute();
const router = useRouter();
const favoritesStore = useFavoritesStore();
const rulesStore = useRulesStore();

const list = ref([]);
const contentType = ref(CONTENT_TYPE.NOVEL);
const ruleId = ref('');
const rule = ref({});
const categoryList = ref([]);
const loading = ref(false);
const searchText = ref('');

onMounted(() => {
  if (typeof route.params.contentType !== 'undefined') {
    contentType.value = +route.params.contentType;
  }
});

const ruleListDisplay = computed(() => {
  const filterContentType = rulesStore.list.filter((e) => e.enableDiscover && e.contentType === contentType.value);
  if (!searchText.value) return filterContentType;
  return filterContentType.filter((e) => e.name.includes(searchText.value));
});

// 分类被修改
async function changeCategory(row) {
  loading.value = true;
  list.value = [];
  loading.value = true;
  const res = await discover({
    data: JSON.parse(JSON.stringify(row)),
    ruleId: ruleId.value
  });
  list.value = res?.data || [];
  loading.value = false;
}

// 规则被修改
async function changeRule(id) {
  ruleId.value = id;
  loading.value = true;
  rule.value = categoryList.value.find((e) => e.id === id);
  list.value = [];
  categoryList.value = [];
  const res = await discoverMap(ruleId.value);
  categoryList.value = res?.data || [];
  loading.value = false;
}

watch(
  ruleListDisplay,
  (data) => {
    if (data.length > 0) {
      changeRule(data[0].id);
    }
  },
  {
    immediate: true
  }
);
</script>

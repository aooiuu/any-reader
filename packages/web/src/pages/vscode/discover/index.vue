<template>
  <div class="px-10 py-10 h-full flex overflow-hidden">
    <div class="flex flex-col h-full w-120 overflow-hidden bg-[--sideBar-background]">
      <a-select v-model:value="contentType" class="mb-10">
        <a-select-option v-for="o in CONTENT_TYPES" :key="o.value" :value="o.value">{{ o.label }}</a-select-option>
      </a-select>
      <a-input-search v-model:value="searchText" class="mb-10" placeholder="过滤" />

      <div class="flex-1 overflow-auto">
        <div
          v-for="r in ruleListDisplay"
          :key="r.id"
          :class="['h-40 lh-40 mb-2 px-12 cursor-pointer hover:op-70', ruleId === r.id ? 'color-[--textLink-foreground]' : '']"
          @click="changeRule(r)"
        >
          {{ r.name }}
        </div>
      </div>
    </div>

    <div class="h-full flex flex-col flex-1 ml-5 overflow-hidden">
      <ARCategory :list="categoryList" @change="changeCategory" />
      <div v-if="loading" class="w-full h-full flex items-center justify-center">
        <a-spin />
      </div>
      <div v-else-if="list.length" class="mt-10 flex-1 overflow-auto">
        <div class="flex overflow-auto flex-wrap gap-6">
          <div
            v-for="(row, idx) in list"
            :key="idx"
            class="node relative flex flex-col flex-shrink-0 w-102 cursor-pointer hover:op-70"
            @click="
              executeCommand({
                command: 'any-reader.getChapter',
                data: {
                  ruleId,
                  data: row
                }
              })
            "
          >
            <div class="w-102 h-136 mb-5 rounded-5 overflow-hidden">
              <ARCover :src="row.cover" :preview="false" alt="" srcset="" class="cover w-102 h-136" width="100%" height="100%" fit="cover" />
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { StarOutlined, StarFilled } from '@ant-design/icons-vue';
import { CONTENT_TYPES, CONTENT_TYPE } from '@/constants';
import { discover, discoverMap } from '@/api';
import { executeCommand } from '@/api/vsc';
import { useFavoritesStore } from '@/stores/favorites';
import { useRulesStore } from '@/stores/rules';

const favoritesStore = useFavoritesStore();
const rulesStore = useRulesStore();

const list = ref([]);
const contentType = ref(CONTENT_TYPE.NOVEL);
const ruleId = ref('');
const rule = ref({});
const categoryList = ref([]);
const loading = ref(false);
const searchText = ref('');

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
async function changeRule(row) {
  loading.value = true;
  ruleId.value = row.id;
  rule.value = row;
  list.value = [];
  categoryList.value = [];
  const res = await discoverMap(ruleId.value);
  categoryList.value = res?.data || [];
  loading.value = false;
}

watch(
  () => rulesStore.list,
  (data) => {
    if (data.length > 0) {
      changeRule(data[0]);
    }
  },
  {
    immediate: true
  }
);
</script>

<style scoped lang="scss">
.node .cover {
  transition: all ease 0.3s;
}
.node:hover {
  .star {
    visibility: visible;
    &:hover {
      background: rgba(0, 0, 0, 1);
    }
  }

  .cover {
    transform: scale(1.2);
  }
}
</style>

<template>
  <ARRuleEmpty v-if="!rulesStore.list.length" />
  <div v-else class="px-10 py-10 h-full flex flex-col">
    <div class="mb-10 flex gap-10">
      <div class="flex-1 flex items-center gap-10">
        <a-input-group compact class="!flex">
          <a-select v-model:value="contentType">
            <a-select-option v-for="item in CONTENT_TYPES" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
          </a-select>
          <a-input v-model:value="searchText" placeholder="输入关键词，回车键搜索" :disabled="loading" @keyup.enter="onSearch()" />
        </a-input-group>
      </div>
    </div>
    <!-- 搜索进度 -->
    <div v-if="loading" class="flex items-center text-[--foreground]">
      <a-button class="mr-5" @click="cancelSearch">取消</a-button>
      <ASpin />
      <div v-if="runCount > 0" class="ml-2">搜索进度: {{ runCount }}/{{ total }} {{ ((runCount / total) * 100).toFixed(0) }}%</div>
    </div>
    <div class="flex-1 overflow-auto text-[--foreground]">
      <!-- 规则列表 -->
      <template v-for="item in list" :key="item.id">
        <div v-if="item.list.length" class="pt-20">
          <div class="mb-6">{{ item.rule.name }}</div>
          <div class="overflow-hidden">
            <div class="flex overflow-auto gap-5 pb-5">
              <div
                v-for="(row, idx) in item.list"
                :key="idx"
                class="node relative flex flex-col flex-shrink-0 w-102 cursor-pointer hover:op-70"
                @click="
                  router.push({
                    path: '/chapter',
                    query: {
                      ...row,
                      ruleId: item.rule.id,
                      name: row.name,
                      filePath: row.url
                    }
                  })
                "
              >
                <div class="w-102 h-136 mb-5 rounded-5 overflow-hidden">
                  <ARCover
                    :src="row.cover"
                    error-icon="icon-book"
                    :preview="false"
                    alt=""
                    srcset=""
                    class="cover w-102 h-136"
                    width="100%"
                    height="100%"
                    fit="cover"
                  />
                </div>
                <div class="overflow-hidden whitespace-nowrap text-ellipsis mb-2">{{ row.name }}</div>
                <div class="overflow-hidden whitespace-nowrap text-ellipsis text-12 op-70">{{ row.author }}</div>

                <div
                  class="star invisible absolute top-5 right-5 px-2 py-2 rounded-10 bg-[#000000cc] flex items-center justify-center"
                  @click.stop="
                    favoritesStore.star({
                      ...row,
                      ruleId: item.rule.id
                    })
                  "
                >
                  <StarFilled
                    v-if="
                      favoritesStore.starred({
                        ...row,
                        ruleId: item.rule.id
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
      </template>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { v4 as uuidV4 } from 'uuid';
import pLimit from 'p-limit';
import { StarOutlined, StarFilled } from '@ant-design/icons-vue';
import { CONTENT_TYPES, CONTENT_TYPE } from '@/constants';
import { searchByRuleId } from '@/api';
import { useFavoritesStore } from '@/stores/favorites';
import { useRulesStore } from '@/stores/rules';

const favoritesStore = useFavoritesStore();
const rulesStore = useRulesStore();

const router = useRouter();
const route = useRoute();
const runPromise = pLimit(10);

let uuid: string = '';
const searchText = ref('');
const contentType = ref(CONTENT_TYPE.NOVEL);
const contentTypes = computed(() => [contentType.value]);
const loading = ref(false);
const total = ref(0);
const runCount = ref(0);

const list = ref<any[]>([]);

async function onSearch(uid?: string) {
  const lastUuid = uid || uuidV4();
  uuid = lastUuid;
  list.value = [];
  total.value = 0;
  runCount.value = 0;
  loading.value = true;
  const rules = rulesStore.list.filter((e) => contentTypes.value.includes(e.contentType) && e.enableSearch);
  total.value = rules.length;

  const tasks = rules.map((rule) =>
    runPromise(async () => {
      if (lastUuid !== uuid) return;
      runCount.value++;
      const res = await searchByRuleId({ ruleId: rule.id, keyword: searchText.value });
      if (res.code === 0) {
        const rows = res.data;
        if (!rows.length) return;
        list.value.push({
          rule: rule,
          list: rows
        });
      }
    })
  );
  await Promise.all(tasks).catch(() => {});
  loading.value = false;
}

function cancelSearch() {
  uuid = uuidV4();
  loading.value = false;
}

function init() {
  const { keyword, _uuid } = route.query;
  if (searchText.value === keyword && uuid === _uuid) return;
  if (keyword) {
    searchText.value = keyword as string;
    onSearch(_uuid as string);
  }
}

onActivated(init);
onMounted(init);
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

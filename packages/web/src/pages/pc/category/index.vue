<template>
  <ARRuleEmpty v-if="!rulesStore.list.length" />
  <div v-else class="h-full flex flex-col overflow-hidden bg-[--ar-main-background] text-[--ar-color-text] sm:flex-row">
    <div class="rules-panel relative flex flex-col overflow-hidden bg-[--ar-left-bar-bg-secondary] p-10 pb-0 sm:h-full sm:w-140 sm:pb-10">
      <a-select v-if="typeof route.params.contentType === 'undefined'" v-model:value="contentType" class="mb-10">
        <a-select-option v-for="o in CONTENT_TYPES" :key="o.value" :value="o.value">{{ o.label }}</a-select-option>
      </a-select>
      <a-input v-model:value="searchText" class="mb-10" placeholder="过滤" />

      <!-- 分类 -->
      <ARTabs v-model="ruleId" :options="ruleListDisplay" value-key="id" label-key="name" @update:model-value="changeRule">
        <template #default="{ label, item }">
          <div class="rule-item flex items-center">
            <div class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap pr-5">{{ label }}</div>
            <div class="hidden sm:block">
              <PushpinOutlined
                class="rule-item__pind"
                :class="{
                  'rule-item__pind--active': rulesStore.pindStore.includes(item.id)
                }"
                @click.stop="rulesStore.pindRule(item)"
              />
            </div>
          </div>
        </template>
      </ARTabs>
    </div>

    <div class="mx-10 h-full flex flex-1 flex-col overflow-hidden pt-0 sm:pt-10">
      <ARCategory :list="categoryList" @change="changeCategory" />
      <div v-if="loading" class="flex flex-1 items-center justify-center">
        <a-spin />
      </div>
      <div v-else-if="list.length" class="mt-10 flex-1 overflow-auto">
        <div class="flex flex-wrap justify-center gap-6 overflow-auto">
          <div
            v-for="(row, idx) in list"
            :key="idx"
            class="node relative w-102 flex flex-shrink-0 flex-col cursor-pointer hover:op-70"
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
            <div class="mb-5 h-136 w-102 overflow-hidden rounded-5">
              <ARCover :src="row.cover" :preview="false" alt="" srcset="" class="h-136 w-102" width="100%" height="100%" fit="cover" />
            </div>
            <div class="mb-2 overflow-hidden text-ellipsis whitespace-nowrap">{{ row.name }}</div>
            <div class="overflow-hidden text-ellipsis whitespace-nowrap text-12 op-70">{{ row.author }}</div>

            <div
              class="star invisible absolute right-5 top-5 flex items-center justify-center rounded-10 bg-[#000000cc] px-2 py-2"
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
          <div v-for="i in 10" :key="i" class="invisible w-102" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { StarOutlined, StarFilled, PushpinOutlined } from '@ant-design/icons-vue';
import { CONTENT_TYPES } from '@/constants';
import { ContentType } from '@any-reader/rule-utils';
import { discover, discoverMap } from '@/api';
import { useFavoritesStore } from '@/stores/favorites';
import { useRulesStore } from '@/stores/rules';

const route = useRoute();
const router = useRouter();
const favoritesStore = useFavoritesStore();
const rulesStore = useRulesStore();

const list = ref<any[]>([]);
const contentType = ref(ContentType.NOVEL);
const ruleId = ref('');
const rule = ref({});
const categoryList = ref<any[]>([]);
const loading = ref(false);
const searchText = ref('');

const ruleListDisplay = computed(() => {
  const filterContentType = rulesStore.list.filter((e) => e.enableDiscover && e.contentType === contentType.value);
  if (!searchText.value) return filterContentType;
  return filterContentType.filter((e) => e.name.includes(searchText.value));
});

// 分类被修改
async function changeCategory(row: any) {
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
async function changeRule(id: string) {
  ruleId.value = id;
  loading.value = true;
  rule.value = categoryList.value.find((e) => e.id === id);
  list.value = [];
  categoryList.value = [];
  const res = await discoverMap(ruleId.value);
  categoryList.value = res?.data || [];
  loading.value = false;
}

let activated = true;
watch(
  ruleListDisplay,
  (data) => {
    if (data.length > 0 && activated) {
      changeRule(data[0].id);
    }
  },
  {
    immediate: true
  }
);

onMounted(() => {
  activated = true;
  if (typeof route.params.contentType !== 'undefined') {
    contentType.value = +route.params.contentType;
  }
});

onActivated(() => {
  activated = true;
});
onDeactivated(() => {
  activated = false;
});
</script>

<style scoped lang="scss">
.rules-panel {
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 1px;
    background-color: var(--ar-top-bar-border-bottom);
  }
}

.rule-item {
  &__pind {
    display: none !important;
    color: var(--ar-color-text);

    &--active {
      color: var(--ar-color-primary);
    }
  }

  &:hover {
    .rule-item__pind {
      display: inline-block !important;
    }
  }
}
</style>

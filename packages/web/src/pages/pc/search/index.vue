<template>
  <ARRuleEmpty v-if="!rulesStore.list.length" />
  <div v-else class="h-full flex flex-col bg-[--ar-main-background] px-10 py-10 text-[--ar-color-text]">
    <div class="mb-10 flex gap-10">
      <div class="flex flex-1 items-center gap-10">
        <a-input-group compact class="!flex">
          <a-select v-model:value="contentType">
            <a-select-option v-for="item in CONTENT_TYPES" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
          </a-select>
          <a-input v-model:value="searchText" placeholder="输入关键词，回车键搜索" :disabled="loading" @keyup.enter="onSearch()" />
        </a-input-group>
      </div>
    </div>
    <!-- 搜索进度 -->
    <div v-if="loading" class="flex items-center text-[--ar-color-text]">
      <a-button class="mr-5" @click="cancelSearch">取消</a-button>
      <ASpin />
      <div v-if="runCount > 0" class="ml-2">搜索进度: {{ runCount }}/{{ total }} {{ ((runCount / total) * 100).toFixed(0) }}%</div>
    </div>
    <div class="flex-1 overflow-auto text-[--ar-color-text]">
      <!-- 规则列表 -->
      <template v-for="item in list" :key="item.id">
        <div v-if="item.list.length" class="pt-20">
          <div class="mb-6">{{ item.rule.name }}</div>
          <div class="overflow-hidden">
            <div class="flex gap-5 overflow-auto pb-5">
              <div
                v-for="(row, idx) in item.list"
                :key="idx"
                class="node relative w-102 flex flex-shrink-0 flex-col cursor-pointer hover:op-70"
                @click="getChapter(row, item.rule)"
              >
                <div class="mb-5 h-136 w-102 overflow-hidden rounded-5">
                  <ARCover
                    :src="row.cover"
                    error-icon="icon-book"
                    :preview="false"
                    alt=""
                    srcset=""
                    class="cover h-136 w-102"
                    width="100%"
                    height="100%"
                    fit="cover"
                  />
                </div>
                <div class="mb-2 overflow-hidden text-ellipsis whitespace-nowrap">{{ row.name }}</div>
                <div class="overflow-hidden text-ellipsis whitespace-nowrap text-12 op-70">{{ row.author }}</div>

                <div
                  class="star invisible absolute right-5 top-5 flex items-center justify-center rounded-10 bg-[#000000cc] px-2 py-2"
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
import { CONTENT_TYPES } from '@/constants';
import { useRulesStore } from '@/stores/rules';
import { useFavoritesStore } from '@/stores/favorites';
import { useSearch } from '@/pages/common/search';

const favoritesStore = useFavoritesStore();
const rulesStore = useRulesStore();

const { contentType, searchText, onSearch, cancelSearch, loading, runCount, total, list, getChapter } = useSearch();
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

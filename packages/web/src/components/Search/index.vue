<template>
  <div
    v-if="searchVisible"
    ref="searchRef"
    class="fixed left-50% top-5 w-400 flex flex-col translate-x--50% overflow-hidden rounded-4 bg-[--ar-main-background] p-10"
    :style="{
      boxShadow: '0px 0px 5px 5px rgba(0, 0, 0, 0.2)'
    }"
  >
    <a-input-search
      ref="inputRef"
      v-model:value="searchText"
      placeholder="输入关键词，回车键搜索"
      class="w-full"
      allow-clear
      @keyup.enter="onSearch"
    />
  </div>
</template>

<script setup>
import { v4 as uuidV4 } from 'uuid';
import { useBus, EVENT_SEARCH_BOX } from '@/utils/bus';
import { onClickOutside } from '@vueuse/core';

const router = useRouter();
const searchRef = ref();
const searchText = ref('');
const inputRef = ref();

const searchVisible = ref(false);
const searchBox = useBus(EVENT_SEARCH_BOX);

function openSearchBox() {
  searchText.value = '';
  searchVisible.value = true;
  nextTick(() => {
    inputRef.value.focus();
  });
}

const unsubscribe = searchBox.on(openSearchBox);

onDeactivated(() => {
  unsubscribe();
});

onClickOutside(searchRef, () => {
  searchVisible.value = false;
});

function onSearch() {
  searchVisible.value = false;
  if (!searchText.value) return;
  router.push({
    name: 'search',
    query: {
      keyword: searchText.value,
      _uuid: uuidV4()
    }
  });
}
</script>

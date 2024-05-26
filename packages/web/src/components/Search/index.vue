<template>
  <div
    v-if="searchVisible"
    ref="searchRef"
    class="fixed top-5 left-50% translate-x--50% rounded-4 overflow-hidden w-400 flex flex-col bg-[--main-background] p-10"
    :style="{
      boxShadow: '0px 0px 5px 5px rgba(0, 0, 0, 0.2)'
    }"
  >
    <a-input-search ref="inputRef" v-model="searchText" placeholder="输入关键词，回车键搜索" class="w-full" @keyup.enter="onSearch" />
  </div>
</template>

<script setup>
import { v4 as uuidV4 } from 'uuid';
import { useSearchBox } from '@/utils/bus';
import { onClickOutside } from '@vueuse/core';

const router = useRouter();
const searchRef = ref();
const searchText = ref('');
const inputRef = ref();

const searchVisible = ref(false);
const searchBox = useSearchBox();

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

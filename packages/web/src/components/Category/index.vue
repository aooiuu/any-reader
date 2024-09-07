<template>
  <div class="mb-5 flex select-none items-center overflow-hidden">
    <div class="mx-2 cursor-pointer hover:text-[--ar-color-primary-text]" @click="scrollToLeft">
      <LeftOutlined />
    </div>
    <div ref="navsRef" class="ar-scrollbar-none w-full flex overflow-x-auto overflow-y-hidden" @wheel="onWheel($event)">
      <div
        v-for="item in props.list"
        :key="item.name"
        :class="[
          'flex-shrink-0 h-32 lh-32 px-10 rounded-10 cursor-pointer hover:bg-[--ar-color-primary-bg]',
          value === item.name ? ' bg-[--ar-color-primary-bg] text-[--ar-color-primary-text]' : ''
        ]"
        @click="onInput(item.name)"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="mx-2 cursor-pointer hover:text-[--ar-color-primary-text]" @click="scrollToRight">
      <RightOutlined />
    </div>
  </div>
  <Category v-if="nextList.length > 1" :list="nextList" @change="(row: any) => emit('change', row)" />
</template>

<script setup lang="ts">
import { useTabs } from '@/components/Tabs/useTabs';
import Category from './index.vue';

const props = defineProps<{
  list: any[];
}>();

const emit = defineEmits(['change']);

const value = ref<string>('');
const nextList = ref([]);
const navsRef = ref();

const { scrollToLeft, scrollToRight, onWheel } = useTabs(navsRef);

function onInput(v: any) {
  if (!v) return;
  value.value = v;
  const row = props.list.find((e) => e.name === value.value);
  nextList.value = row.pairs || [];
  if (nextList.value.length === 0) {
    // 没有子项目时, 加载本身
    emit('change', row);
  } else if (nextList.value.length === 1) {
    // 只有一个子项目的时候加载子项目
    emit('change', nextList.value[0]);
  }
}

watch(
  () => props.list,
  (v) => {
    onInput(v?.[0]?.name || '');
  },
  {
    immediate: true
  }
);
</script>

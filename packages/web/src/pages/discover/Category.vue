<template>
  <div class="w-full">
    <a-radio-group :model-value="value" type="button" class="w-full overflow-auto" @update:model-value="onInput">
      <a-radio v-for="item in props.list" :key="item.name" :value="item.name" class="block flex-shrink-0">{{ item.name }}</a-radio>
    </a-radio-group>

    <Category v-if="nextList.length > 1" :list="nextList" @change="(row) => emit('change', row)" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  list: any[];
}>();

const emit = defineEmits(['change']);

const value = ref<string>('');
const nextList = ref([]);

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

<template>
  <SettingRow :title="props.title">
    <a-input v-model:value="modelValue" class="!w-200px" @keydown="keydown" @keyup="keyup" />
  </SettingRow>
</template>

<script setup lang="ts">
import SettingRow from '../SettingRow/index.vue';

const modelValue = defineModel<string>();

const props = defineProps<{
  title: string;
  keyText: string;
}>();

let isWatch = false;

watch(
  () => props.keyText,
  (v) => {
    if (isWatch) {
      modelValue.value = v;
    }
  }
);

function keydown() {
  isWatch = true;
}

function keyup() {
  isWatch = false;
}
</script>

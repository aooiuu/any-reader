<template>
  <SettingRow :title="props.title">
    <vscode-text-field
      :value="modelValue"
      class="w-full"
      @input="(event: any) => (modelValue = event.target.value)"
      @keydown="keydown"
      @keyup="keyup"
    >
    </vscode-text-field>
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

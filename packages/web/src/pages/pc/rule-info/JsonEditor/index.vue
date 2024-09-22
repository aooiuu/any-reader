<template>
  <div class="flex-1 overflow-auto">
    <codemirror v-model="modelValue" class="h-full w-full" :autofocus="true" :extensions="extensions" />
  </div>
</template>

<script setup lang="ts">
import { Codemirror } from 'vue-codemirror';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';

const extensions = [json(), oneDark];

const modelValue = defineModel<string>();
</script>

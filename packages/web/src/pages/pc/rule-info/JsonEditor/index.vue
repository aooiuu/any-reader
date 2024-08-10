<template>
  <div class="flex-1 overflow-auto">
    <div ref="monacoEl" class="h-full w-full"></div>
  </div>
</template>

<script setup lang="ts">
import { monaco } from '@/utils/monaco';
import type { editor as Editor } from 'monaco-editor';

const modelValue = defineModel<string>();
let lastValue = '';

const monacoEl = ref<HTMLElement>();
let editor!: Editor.IStandaloneCodeEditor;

onMounted(() => {
  editor = monaco.editor.create(monacoEl.value!, {
    value: modelValue.value,
    language: 'json',
    theme: 'vs-dark',
    automaticLayout: true,
    minimap: {
      enabled: false
    }
  });
  // configure the JSON language support with schemas and schema associations
  // monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
  //   validate: true
  // });
  editor.onDidChangeModelContent(() => {
    const value = editor.getValue();
    if (modelValue.value !== value) {
      lastValue = value;
      modelValue.value = value;
    }
  });
});

watch(modelValue, (value) => {
  if (value !== lastValue) editor?.setValue(value as string);
});

onUnmounted(() => {
  editor?.dispose();
});
</script>

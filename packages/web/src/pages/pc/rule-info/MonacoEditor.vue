<template>
  <div ref="monacoEl" class="w-full h-full"></div>
</template>

<script setup>
import { monaco } from '@/utils/monaco';

const modelValue = defineModel();
let lastValue = '';

const monacoEl = ref();
let editor;

onMounted(() => {
  editor = monaco.editor.create(monacoEl.value, {
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
  if (value !== lastValue) editor?.setValue(value);
});

onUnmounted(() => {
  editor?.dispose();
});
</script>

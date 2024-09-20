<template>
  <div>
    <div class="details custom-block !p-10px">
      <textarea v-model="inputText" rows="5" class="w-full bg-[transparent]" placeholder="这里输入原始文本, 比如网页源码" />
    </div>

    <div class="flex items-center text-14">
      <input id="isList" v-model="isList" type="checkbox" name="isList" />
      <label for="isList">列表规则</label>
    </div>

    <div class="details custom-block !p-10px">
      <input v-model="rule" class="w-full" placeholder="这里输入规则, 比如 xpath, jsonpath 等等组合" />
    </div>
    <div class="details custom-block !p-10px">
      <div class="min-h-40px break-words">
        {{ outputText || '' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue';
import { useEventListener } from '@vueuse/core';
import { createAnalyzerManager } from '@any-reader/core/browser';
import { decodeHash, encodeHash } from '../../utils/hash';

const analyzerManager = createAnalyzerManager();

const inputText = ref('');
const rule = ref('');
const outputText = ref('');
const isList = ref(false);

watch([inputText, rule, isList], () => {
  nextTick(async () => {
    outputText.value = isList.value
      ? JSON.stringify(await analyzerManager.getElements(rule.value, inputText.value))
      : await analyzerManager.getString(rule.value, inputText.value);
  });

  try {
    history.replaceState(
      {},
      '',
      '#' +
        encodeHash({
          inputText: inputText.value,
          rule: rule.value,
          isList: isList.value
        })
    );
  } catch (error) {
    console.error(error);
  }
});

function hashchange() {
  try {
    const data = decodeHash();
    inputText.value = data.inputText || '';
    rule.value = data.rule || '';
    isList.value = data.isList || false;
  } catch (error) {
    console.error(error);
  }
}
onMounted(() => {
  hashchange();
});

useEventListener('hashchange', hashchange);
</script>

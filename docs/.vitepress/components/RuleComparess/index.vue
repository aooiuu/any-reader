<template>
  <div>
    <div class="details custom-block !p-10px">
      <textarea v-model="inputText" rows="5" class="w-full bg-[transparent]" placeholder="输入规则,'eso://:xxxxx' 或者 json 字符串" />
    </div>

    <div class="details custom-block !p-10px">
      <div class="min-h-40px whitespace-pre-wrap break-words">
        {{ outputText || '' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue';
import { useEventListener } from '@vueuse/core';
import { decodeRule, encodeRule } from '@any-reader/rule-utils';
import { decodeHash, encodeHash } from '../../utils/hash';

const inputText = ref('');
const outputText = ref('');

watch([inputText], () => {
  outputText.value = '';
  nextTick(() => {
    const rule = inputText.value.trim();
    if (rule.startsWith('eso://')) {
      outputText.value = JSON.stringify(decodeRule(rule), null, 4);
    } else {
      outputText.value = encodeRule(rule);
    }
  });

  try {
    history.replaceState(
      {},
      '',
      '#' +
        encodeHash({
          inputText: inputText.value
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
  } catch (error) {
    console.error(error);
  }
}

onMounted(() => {
  hashchange();
});

useEventListener('hashchange', hashchange);
</script>

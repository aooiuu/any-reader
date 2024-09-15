<template>
  <div>
    <div class="details custom-block !p-10px">
      <textarea rows="5" class="w-full bg-[transparent]" v-model="inputText" placeholder="输入规则,'eso://:xxxxx' 或者 json 字符串" />
    </div>

    <div class="details custom-block !p-10px">
      <div class="min-h-40px break-words">
        {{ outputText || '' }}
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { encode, decode } from 'js-base64';
import { decodeRule, encodeRule } from '@any-reader/rule-utils'


const inputText = ref('')
const outputText = ref('')

watch([inputText,], () => {
  outputText.value = ''
  nextTick(() => {
    const rule = inputText.value.trim()
    if (rule.startsWith('eso://')) {
      outputText.value = decodeRule(rule)
    } else {
      outputText.value = encodeRule(rule)
    }
  })

  try {
    const newHash = decodeURI(encode(JSON.stringify({
      inputText: inputText.value,
    })))
    history.replaceState({}, '', '#' + newHash)

  } catch (error) {
    console.error(error);

  }
})

onMounted(() => {
  const hash = location.hash.slice(1)
  if (hash) {
    try {
      const data = JSON.parse(decodeURI(decode(hash)))
      inputText.value = data.inputText
    } catch (error) {
      console.error(error);
    }
  }
})
</script>

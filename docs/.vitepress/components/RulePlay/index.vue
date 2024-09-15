<template>
  <div>
    <div class="details custom-block !p-10px">
      <textarea rows="5" class="w-full bg-[transparent]" v-model="inputText" placeholder="这里输入原始文本, 比如网页源码" />
    </div>

    <div class="text-14 flex items-center">
      <input type="checkbox" id="isList" name="isList" v-model="isList" />
      <label for="isList">列表规则</label>
    </div>

    <div class="details custom-block !p-10px">
      <input class="w-full" v-model="rule" placeholder="这里输入规则, 比如 xpath, jsonpath 等等组合" />
    </div>
    <div class="details custom-block !p-10px">
      <div class="min-h-40px">
        {{ outputText || '' }}
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { encode, decode } from 'js-base64';
import { createAnalyzerManager } from '@any-reader/core/browser'

const analyzerManager = createAnalyzerManager()

const inputText = ref('')
const rule = ref('')
const outputText = ref('')
const isList = ref(false)

watch([inputText, rule, isList], v => {


  nextTick(async () => {
    outputText.value =
      isList.value ?
        JSON.stringify(await analyzerManager.getElements(rule.value, inputText.value))
        : await analyzerManager.getString(rule.value, inputText.value)
  })

  try {
    const newHash = decodeURI(encode(JSON.stringify({
      inputText: inputText.value,
      rule: rule.value,
      isList: isList.value,
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
      rule.value = data.rule
      isList.value = data.isList
    } catch (error) {
      console.error(error);
    }
  }

})
</script>

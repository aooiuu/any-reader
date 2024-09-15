<template>
  <div>
    <div class="details custom-block !p-10px">
      <input class="w-full" v-model="inputText" placeholder="这里输入原始文本, 比如网页源码" />
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
import { ref, watch, nextTick } from 'vue'
import { createAnalyzerManager } from '@any-reader/core/browser'

const analyzerManager = createAnalyzerManager()

const inputText = ref('')
const rule = ref('')
const outputText = ref('')

watch([inputText, rule], v => {
  nextTick(async () => {
    outputText.value = await analyzerManager.getString(rule.value, inputText.value)
  })
})
</script>

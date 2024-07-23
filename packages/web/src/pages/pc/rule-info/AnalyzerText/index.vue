<template>
  <AForm :auto-label-width="true" class="flex-1 overflow-auto pr-10" layout="vertical">
    <AFormItem label="源文本">
      <a-textarea
        v-model:value="inputText"
        placeholder="输入原始文本, 通常为网络请求后拿到的字符串，比如网页源码、JSON、XML"
        :auto-size="{ minRows: 2, maxRows: 5 }"
      />
    </AFormItem>
    <AFormItem label="规则">
      <a-textarea
        v-model:value="ruleText"
        placeholder="输入规则文本，XPath、JSONPath、CSS选择器、正则、JS 等任意组合"
        :auto-size="{ minRows: 2, maxRows: 5 }"
      />
    </AFormItem>
    <AFormItem label="是否数组">
      <a-switch v-model:checked="isArray" />
    </AFormItem>
    <AFormItem label="">
      <a-button class="ml-5" type="primary" @click="analyzer">测试</a-button>
    </AFormItem>
    <a-divider>结果</a-divider>
    <a-spin :spinning="loading" class="w-full">
      <AFormItem label="结果">
        <div v-if="Array.isArray(outputText)" class="max-h-300 overflow-auto pr-10">
          <a-textarea
            v-for="(item, idx) in outputText"
            :key="idx"
            :value="item"
            placeholder="点击测试后输出的结果"
            readonly
            :auto-size="{ minRows: 1, maxRows: 2 }"
          />
        </div>
        <a-textarea v-else :value="outputText" placeholder="点击测试后输出的结果" readonly :auto-size="{ minRows: 2, maxRows: 5 }" />
      </AFormItem>
    </a-spin>
  </AForm>
</template>

<script setup lang="ts">
import { analyzerText } from '@/api/modules/rule-manager';

const inputText = ref<string>('');
const outputText = ref<string | string[]>('');
const ruleText = ref<string>('');
const isArray = ref<boolean>(false);
const loading = ref<boolean>(false);

async function analyzer() {
  loading.value = true;
  outputText.value = '';
  const res = await analyzerText({
    inputText: inputText.value,
    ruleText: ruleText.value,
    isArray: isArray.value
  });
  loading.value = false;
  if (res?.code === 0) {
    outputText.value = res.data;
  }
}
</script>

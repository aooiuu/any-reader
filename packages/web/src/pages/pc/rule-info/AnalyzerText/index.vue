<template>
  <AForm :auto-label-width="true" class="flex-1 overflow-auto pr-10" layout="vertical">
    <AFormItem>
      <template #label>
        <span>源文本</span>
        <CopyOutlined class="ml-10 cursor-pointer hover:op-70" @click="copy(inputText)" />
      </template>
      <a-textarea
        v-model:value="inputText"
        placeholder="输入原始文本, 通常为网络请求后拿到的字符串，比如网页源码、JSON、XML"
        :auto-size="{ minRows: 2, maxRows: 5 }"
      />
    </AFormItem>
    <AFormItem>
      <template #label>
        <span>规则</span>
        <CopyOutlined class="ml-10 cursor-pointer hover:op-70" @click="copy(ruleText)" />
      </template>
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
      <AFormItem>
        <template #label>
          <span>结果</span>
          <CopyOutlined class="ml-10 cursor-pointer hover:op-70" @click="copy(stringify(outputText))" />
        </template>
        <div v-if="Array.isArray(outputText)" class="max-h-300 overflow-auto pr-10">
          <a-textarea
            v-for="(item, idx) in outputText"
            :key="idx"
            :value="stringify(item)"
            placeholder="点击测试后输出的结果"
            readonly
            :auto-size="{ minRows: 1, maxRows: 2 }"
          />
        </div>
        <a-textarea v-else :value="stringify(outputText)" placeholder="点击测试后输出的结果" readonly :auto-size="{ minRows: 2, maxRows: 5 }" />
      </AFormItem>
    </a-spin>
  </AForm>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { CopyOutlined } from '@ant-design/icons-vue';
import { analyzerText } from '@/api/modules/rule-manager';

const { copy } = useClipboard();
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

function stringify(o: any) {
  return typeof o === 'string' ? o : JSON.stringify(o);
}

defineExpose({
  debug: ({ inputText: _inputText, isArray: _isArray, ruleText: _ruleText }: { inputText?: string; ruleText?: string; isArray: boolean }) => {
    typeof _ruleText === 'string' && (ruleText.value = _ruleText);
    typeof _inputText === 'string' && (inputText.value = _inputText);
    isArray.value = _isArray;
  }
});
</script>

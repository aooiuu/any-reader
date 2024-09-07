<template>
  <AForm :auto-label-width="true" class="flex-1 overflow-auto pr-10" layout="vertical">
    <AFormItem>
      <template #label>
        <span>URL规则</span>
        <CopyOutlined class="ml-10 cursor-pointer hover:op-70" @click="copy(inputText)" />
      </template>

      <a-textarea v-model:value="inputText" placeholder="" :auto-size="{ minRows: 2, maxRows: 5 }" />
    </AFormItem>
    <AFormItem label="keyword">
      <a-textarea v-model:value="keyword" placeholder="" :auto-size="{ minRows: 2, maxRows: 5 }" />
    </AFormItem>
    <AFormItem label="">
      <a-button class="ml-5" type="primary" @click="analyzer">测试</a-button>
    </AFormItem>
    <a-divider>结果</a-divider>
    <a-spin :spinning="loading" class="w-full">
      <AFormItem>
        <template #label>
          <span>请求结果</span>
          <CopyOutlined class="ml-10 cursor-pointer hover:op-70" @click="copy(body)" />
          <BugOutlined class="ml-10 cursor-pointer hover:op-70" @click="emit('debug', body)" />
        </template>
        <a-textarea v-model:value="body" placeholder="点击测试后输出的结果" readonly :auto-size="{ minRows: 2, maxRows: 10 }" />
      </AFormItem>
      <AFormItem>
        <template #label>
          <span>请求参数</span>
          <CopyOutlined class="ml-10 cursor-pointer hover:op-70" @click="copy(params)" />
        </template>
        <a-textarea v-model:value="params" placeholder="点击测试后输出的结果" readonly :auto-size="{ minRows: 2, maxRows: 5 }" />
      </AFormItem>
    </a-spin>
  </AForm>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import type { Rule } from '@any-reader/rule-utils';
import { analyzerUrl } from '@/api/modules/rule-manager';

const { copy } = useClipboard();

const props = defineProps<{
  rule: Rule;
}>();
const inputText = ref<string>('');
const keyword = ref<string>('');
const loading = ref<boolean>(false);
const params = ref<string>('');
const body = ref<string>('');

async function analyzer() {
  loading.value = true;
  params.value = '';
  body.value = '';
  const res = await analyzerUrl({
    rule: props.rule,
    url: inputText.value,
    keyword: keyword.value
  });
  loading.value = false;
  if (res?.code === 0) {
    params.value = JSON.stringify(res.data.params);
    body.value = res.data.body;
  }
}

defineExpose({
  setUrl: (text: string) => {
    inputText.value = text;
  }
});

const emit = defineEmits(['debug']);
</script>

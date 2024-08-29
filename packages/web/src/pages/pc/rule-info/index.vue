<template>
  <div class="h-full w-full">
    <div v-if="loading" class="h-full w-full flex items-center justify-center">
      <a-spin />
    </div>
    <div v-else class="h-full flex flex-col overflow-hidden px-10 py-10">
      <div class="flex flex-1 flex-col overflow-hidden">
        <div class="mb-10 flex">
          <a-radio-group v-model:value="formType" type="button">
            <a-radio-button value="Form">表单</a-radio-button>
            <a-radio-button value="JSON">JSON</a-radio-button>
          </a-radio-group>
          <div class="flex-1" />
          <a-radio-group v-model:value="formType" type="button">
            <a-radio-button value="AnalyzerRule">搜索测试</a-radio-button>
            <a-radio-button value="AnalyzerURL">URL测试</a-radio-button>
            <a-radio-button value="AnalyzerText">取文本测试</a-radio-button>
          </a-radio-group>
        </div>

        <div class="flex flex-1 overflow-hidden">
          <AForm v-show="formType === 'Form'" :model="formData" :label-col="{ class: 'w-full' }" class="flex-1 overflow-auto pr-10" layout="vertical">
            <a-radio-group v-model:value="formStep" type="button" direction="vertical" class="mb-10">
              <a-radio-button :value="1">基础信息</a-radio-button>
              <a-radio-button :value="2">搜索</a-radio-button>
              <a-radio-button :value="3">章节列表</a-radio-button>
              <a-radio-button :value="4">内容</a-radio-button>
              <a-radio-button :value="5">发现页</a-radio-button>
            </a-radio-group>

            <template v-for="item in FORM_ITEMS" :key="item.prop">
              <AFormItem v-if="item.formStep === formStep && (!item.show || item.show(formData))">
                <template #label>
                  <div class="w-full flex items-center">
                    <div class="flex flex-1">
                      <span>{{ item.label }}</span>
                      <span class="ml-10 text-12 op-70">{{ item.prop }}</span>
                    </div>
                    <BugOutlined v-if="item.debug" class="ml-10 cursor-pointer hover:op-70" @click="debugField(item)" />
                  </div>
                </template>
                <template v-if="item.type === 'select'">
                  <!-- eslint-disable-next-line prettier/prettier -->
                  <a-select v-model:value="(formData[item.prop] as number)">
                    <a-select-option v-for="o in item.options" :key="o.value" :value="o.value">{{ o.label }}</a-select-option>
                  </a-select>
                </template>
                <template v-else-if="item.type === 'number'">
                  <!-- eslint-disable-next-line prettier/prettier -->
                  <a-input-number v-model:value="(formData[item.prop] as number)" :min="0"  />
                </template>
                <template v-else-if="item.type === 'textarea'">
                  <!-- eslint-disable-next-line prettier/prettier -->
                  <a-textarea v-model:value="(formData[item.prop] as string)"  :auto-size="{ minRows: 2,  maxRows: 5  }" />
                </template>
                <template v-else-if="item.type === 'switch'">
                  <a-switch v-model:checked="formData[item.prop]" />
                </template>
                <template v-else>
                  <!-- eslint-disable-next-line prettier/prettier -->
                  <a-input v-model:value="(formData[item.prop] as string)"  />
                </template>
              </AFormItem>
            </template>
          </AForm>
          <JsonEditor v-show="formType === 'JSON'" :model-value="formDataText" @update:model-value="setFormData" />
          <AnalyzerRule v-show="formType === 'AnalyzerRule'" :rule="formData" />
          <AnalyzerText v-show="formType === 'AnalyzerText'" ref="analyzerTextRef" />
          <AnalyzerURL v-show="formType === 'AnalyzerURL'" ref="analyzerURLRef" :rule="formData" @debug="debugBody" />
        </div>
      </div>

      <div class="mt-10 flex justify-end gap-5">
        <a-button @click="router.back">返回</a-button>
        <a-button type="primary" @click="submit">确定</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BugOutlined } from '@ant-design/icons-vue';
import type { Rule } from '@any-reader/rule-utils';
import { ContentType, createRule as createRuleJson } from '@any-reader/rule-utils';
import { FORM_ITEMS, type FormItem } from './constants';
import { getRuleById, createRule } from '@/api';
import JsonEditor from './JsonEditor/index.vue';
import AnalyzerText from './AnalyzerText/index.vue';
import AnalyzerURL from './AnalyzerURL/index.vue';
import AnalyzerRule from './AnalyzerRule/index.vue';

const loading = ref(false);

const router = useRouter();
const route = useRoute();

type FormType = 'JSON' | 'Form' | 'AnalyzerRule' | 'AnalyzerText' | 'AnalyzerURL';
const formType = ref<FormType>('Form');
const formStep = ref(1);

const formData = reactive<Rule>(Object.assign(createRuleJson({ author: '', contentType: ContentType.NOVEL })));

// 规则字符串
const formDataText = computed(() => JSON.stringify(formData, null, 4));

const RuleKeys = Object.keys(formData) as (keyof Rule)[];

// 更新规则
function setFormData(v: string) {
  const json = JSON.parse(v) as Rule;
  RuleKeys.forEach((k) => {
    Object.assign(formData, {
      [k]: json[k]
    });
  });
}

const analyzerTextRef = ref();
const analyzerURLRef = ref();

function debugField(formItem: FormItem) {
  if (formItem.prop.includes('Url')) {
    formType.value = 'AnalyzerURL';
    analyzerURLRef.value.setUrl(formData[formItem.prop]);
  } else if (formItem.prop.includes('List')) {
    formType.value = 'AnalyzerText';
    analyzerTextRef.value.debug({
      ruleText: formData[formItem.prop],
      isArray: true
    });
  } else {
    formType.value = 'AnalyzerText';
    analyzerTextRef.value.debug({
      ruleText: formData[formItem.prop],
      isArray: false
    });
  }
}

function debugBody(body: string) {
  formType.value = 'AnalyzerText';
  analyzerTextRef.value.debug({
    inputText: body,
    isArray: false
  });
}

async function submit() {
  await createRule({
    ...formData
  });
  router.back();
}

onMounted(async () => {
  if (route.query.id) {
    loading.value = true;
    const res = await getRuleById(route.query.id as string);
    if (res.code === 0) {
      Object.assign(formData, res.data);
    }
    loading.value = false;
  }
});
</script>

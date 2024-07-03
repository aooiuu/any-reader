<template>
  <div class="py-20">
    <a-form :model="formData" :rules="formRules" @finish="onFinish">
      <a-form-item label="规则名称" name="name">
        <a-input v-model:value="formData.name" placeholder="请输入规则名称" />
      </a-form-item>
      <a-form-item label="规则类型" name="type">
        <a-radio-group v-model:value="formData.type" :options="cmsTypes" />
      </a-form-item>
      <a-form-item label="接口地址" name="api">
        <a-input v-model:value="formData.api" placeholder="https://xxx" />
      </a-form-item>
      <div class="flex justify-end">
        <a-button type="primary" :loading="loading" html-type="submit">确定</a-button>
      </div>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { App } from 'ant-design-vue';
import { importCMS } from '@/api';

const emit = defineEmits(['done']);
const { message } = App.useApp();

const cmsTypes = [
  { label: '苹果CMS (json)', value: 'maccms.json' },
  { label: '苹果CMS (xml)', value: 'maccms.xml' }
];

const formData = reactive({
  type: 'maccms.json',
  name: '',
  api: ''
});

const formRules = {
  type: [{ required: true, message: '请输入' }],
  name: [{ required: true, message: '请输入' }],
  api: [{ required: true, message: '请输入' }]
};

const loading = ref(false);

const onFinish = async (values: any) => {
  loading.value = true;
  const res = await importCMS(values).catch(() => {});
  loading.value = false;
  if (res.code === 0) {
    emit('done', res.data);
  } else {
    message.warning({
      content: `导入失败`
    });
  }
};
</script>

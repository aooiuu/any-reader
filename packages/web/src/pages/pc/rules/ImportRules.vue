<template>
  <div>
    <div class="flex mb-10">
      <a-textarea v-model:value="url" :disabled="loading" :placeholder="placeholder" :auto-size="{ minRows: 8, maxRows: 10 }" class="flex-1 mr-5" />
    </div>
    <div class="op-70">
      <icon-exclamation-circle-fill />
      网络不佳可能导致从URL导入不成功
    </div>
    <div class="flex justify-end">
      <a-button :disabled="!canSubmit" type="primary" :loading="loading" @click="submit">确定</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { App } from 'ant-design-vue';
import { importRules } from '@/api';

const emit = defineEmits(['done']);
const { message } = App.useApp();

const placeholder = `可以是以下类型：
http://
https://
eso://
[{...}]
{...}
`;

const loading = ref(false);

const url = ref('');

/**
 *
 * @param {string} str
 * @returns {boolean}
 */
function isESO(str: string): boolean {
  return str.startsWith('eso://');
}

const canSubmit = computed(() => {
  if (!url.value) return false;
  if (isESO(url.value)) {
    return true;
  }
  if (/https?:\/\/.{3,}/.test(url.value)) return true;
  if (['{', '['].includes(url.value[0])) {
    return true;
  }
  return false;
});

async function submit() {
  loading.value = true;
  const res = await importRules({ url: url.value }).catch(() => {});
  loading.value = false;
  if (res?.code === 0) {
    emit('done', res.data);
  } else {
    message.warning({
      content: `导入失败`
    });
  }
}
</script>

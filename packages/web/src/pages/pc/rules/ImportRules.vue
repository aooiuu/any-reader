<template>
  <div>
    <div class="flex mb-10">
      <a-input v-model="url" :disabled="loading" placeholder="https://" class="flex-1 mr-5" />
      <a-button :disabled="!canSubmit" type="primary" :loading="loading" @click="submit">确定</a-button>
    </div>
    <div class="op-70">
      <icon-exclamation-circle-fill />
      网络不佳可能导致导入不成功
    </div>
  </div>
</template>

<script setup>
import { Message } from '@arco-design/web-vue';
import { importRules } from '@/api';

const emit = defineEmits(['done']);

const loading = ref(false);

const url = ref('');

const canSubmit = computed(() => url.value && /https?:\/\/.{3,}/.test(url.value));

async function submit() {
  loading.value = true;
  const res = await importRules({ url: url.value }).catch(() => {});
  loading.value = false;
  if (res.code === 0) {
    emit('done', res.data);
  } else {
    Message.warning({
      content: `导入失败`,
      closable: true,
      resetOnHover: true
    });
  }
}
</script>

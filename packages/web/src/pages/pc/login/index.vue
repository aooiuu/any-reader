<template>
  <div class="h-full w-full overflow-hidden bg-[#1f1f1f] text-16">
    <div class="max-w-400 mt-20vh mx-a bg-[#252526] p-20 rounded-4">
      <div class="text-[#cccccc] mb-20 b-b-1 b-b-solid b-b-[#333333] pb-20">登录</div>
      <div class="flex gap-6">
        <a-input v-model="inputText" type="password"></a-input>
        <a-button :loading="loading" @click="submit">确定</a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import md5 from 'blueimp-md5';
import { login } from '@/api';

const inputText = ref('');
const loading = ref(false);
const router = useRouter();

async function submit() {
  loading.value = true;
  const res = await login({ password: md5(inputText.value) }).catch(() => {});
  loading.value = false;
  if (res?.code === 0) {
    router.push('/');
  }
}
</script>

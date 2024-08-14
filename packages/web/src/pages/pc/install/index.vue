<template>
  <div class="h-full w-full overflow-hidden bg-[#1f1f1f] text-16">
    <div class="mx-a mt-20vh max-w-400 rounded-4 bg-[#252526] p-20">
      <div class="mb-20 b-b-1 b-b-[#333333] b-b-solid pb-20 text-[#cccccc]">第一次登录，请设置密码</div>
      <div class="flex gap-6">
        <a-input v-model:value="inputText" type="password" placeholder="请输入密码，6-25位" />
        <a-button :loading="loading" :disabled="disabled" @click="submit">确定</a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import md5 from 'blueimp-md5';
import bcrypt from 'bcryptjs';
import { install } from '@/api';

const inputText = ref('');
const loading = ref(false);
const router = useRouter();

const disabled = computed(() => !/^.{6,25}$/.test(inputText.value));

async function submit() {
  loading.value = true;
  const res = await install({ password: bcrypt.hashSync(md5(inputText.value), 10) }).catch(() => {});
  loading.value = false;
  if (res?.code === 0) {
    router.push('/');
  }
}
</script>

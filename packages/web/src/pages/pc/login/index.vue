<template>
  <div class="h-full w-full overflow-hidden bg-[#1f1f1f] text-16">
    <div class="mx-a mt-20vh max-w-400 rounded-4 bg-[#252526] p-20">
      <div class="mb-20 b-b-1 b-b-[#333333] b-b-solid pb-20 text-[#cccccc]">登录</div>
      <div class="flex gap-6">
        <a-input v-model:value="inputText" type="password"></a-input>
        <a-button :loading="loading" @click="submit">确定</a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import md5 from 'blueimp-md5';
import { login } from '@/api';
import { useRulesStore } from '@/stores/rules';
import { useFavoritesStore } from '@/stores/favorites';

const inputText = ref('');
const loading = ref(false);
const router = useRouter();

async function submit() {
  loading.value = true;
  const res = await login({ password: md5(inputText.value) }).catch(() => {});
  loading.value = false;
  if (res?.code === 0) {
    useRulesStore().sync();
    useFavoritesStore().sync();
    router.push('/');
  }
}
</script>

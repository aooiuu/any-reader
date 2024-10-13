<template>
  <a-config-provider
    :theme="{
      algorithm: theme.darkAlgorithm,
      token
    }"
    :locale="zhCN"
  >
    <a-app class="h-full flex flex-col overflow-hidden">
      <div class="flex-1 overflow-auto">
        <RouterView />
      </div>
    </a-app>
  </a-config-provider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { theme } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { IS_BROWSER } from '@/constants';
import { THEME } from '@/constants/theme';
import { useMessage } from '@/utils/postMessage';
import { useRulesStore } from '@/stores/rules';
import { useFavoritesStore } from '@/stores/favorites';
import { registerTokenToCSSVar } from '@/utils/theme';
import { useMagicKeys } from '@/hooks/useMagicKeys';

const { token: tToken } = theme.useToken();

const token = ref(THEME[THEME.length - 1].theme);
const router = useRouter();

provide('setTheme', (v: any) => {
  token.value = v;
});

watchEffect(() => {
  registerTokenToCSSVar(tToken.value);
});

useRulesStore().sync();
useFavoritesStore().sync();

useMessage('router.push', (data: string) => {
  router.push(data);
});

// 监听热键
const actions = {
  'alt+←': () => {
    router.go(-1);
  },
  'alt+→': () => {
    router.go(1);
  }
};
const { keyText } = useMagicKeys({});
watchEffect(() => {
  if (IS_BROWSER) {
    return;
  }
  if (typeof actions[keyText.value] === 'function') {
    actions[keyText.value]();
  }
});
</script>

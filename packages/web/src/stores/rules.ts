import { getRules } from '@/api';

/**
 * 收藏数据
 */
export const useRulesStore = defineStore('rules', () => {
  // 已收藏列表
  const list = ref<any[]>([]);

  // 同步收藏列表
  async function sync() {
    const res = await getRules();
    if (res?.code === 0) {
      list.value = res.data;
    } else {
      list.value = [];
    }
  }

  return {
    list,
    sync
  };
});

import { getRules, updateRule } from '@/api';

/**
 * 收藏数据
 */
export const useRulesStore = defineStore('rules', () => {
  // 已收藏列表
  const list = ref<any[]>([]);

  // 同步收藏列表
  async function sync() {
    const res = await getRules().catch(() => {});
    if (res?.code === 0) {
      list.value = res.data.sort((a: any, b: any) => b.sort - a.sort);
    } else {
      list.value = [];
    }
  }

  function updateRuleById(id: string, data: any) {
    updateRule({ id, ...data }).then(() => {
      const row = list.value.find((e) => e.id === id);
      if (row) {
        Object.assign(row, data);
      }
    });
  }

  return {
    list,
    sync,
    updateRuleById
  };
});

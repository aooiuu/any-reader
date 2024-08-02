import { getRules, updateRule } from '@/api';
import type { Rule } from '@any-reader/rule-utils';
import { useStorage } from '@vueuse/core';

/**
 * 收藏数据
 */
export const useRulesStore = defineStore('rules', () => {
  // 已收藏列表
  const _rows = ref<Rule[]>([]);

  const pindStore = useStorage<string[]>('rule-pind', []);
  function pindRule(rule: Rule) {
    const idx = pindStore.value.indexOf(rule.id);
    if (idx >= 0) {
      pindStore.value.splice(idx, 1);
    } else {
      pindStore.value.push(rule.id);
    }
  }

  const list = computed(() => {
    return _rows.value.sort((a: Rule, b: Rule) => {
      const _a = pindStore.value.includes(a.id) ? Number.MAX_VALUE : a.sort;
      const _b = pindStore.value.includes(b.id) ? Number.MAX_VALUE : b.sort;
      return _b - _a;
    });
  });

  // 同步收藏列表
  async function sync() {
    const res = await getRules().catch(() => {});
    if (res?.code === 0) {
      _rows.value = res.data || [];
    } else {
      _rows.value = [];
    }
  }

  function updateRuleById(id: string, data: Partial<Rule>) {
    updateRule({ id, ...data }).then(() => {
      const row = _rows.value.find((e) => e.id === id);
      if (row) {
        Object.assign(row, data);
      }
    });
  }

  return {
    list,
    sync,
    updateRuleById,
    pindStore,
    pindRule
  };
});

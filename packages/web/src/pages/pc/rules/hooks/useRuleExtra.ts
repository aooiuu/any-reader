import { getRuleExtras } from '@/api';

interface SourceExtraRow {
  ping?: number;
}

interface SourceExtra {
  [_: string]: SourceExtraRow;
}

export function useRuleExtra() {
  const data = ref<SourceExtra>({});

  async function sync() {
    const res = await getRuleExtras().catch(() => {});
    if (res?.code === 0) {
      data.value = res?.data || [];
    }
  }

  return {
    data,
    sync
  };
}

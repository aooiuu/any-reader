import { getHistory } from '@/api';

interface RecordFile {
  ruleId: string;
  url: string;
}

/**
 * 历史数据
 */
export const useHistoryStore = defineStore('history', () => {
  //列表
  const list = ref<RecordFile[]>([]);

  // 同步列表
  async function sync() {
    const res = await getHistory();
    if (res?.code === 0) {
      list.value = res.data || [];
    } else {
      list.value = [];
    }
  }

  return {
    list,
    sync
  };
});

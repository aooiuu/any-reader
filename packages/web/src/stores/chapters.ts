import { getChapter } from '@/api';

interface Chapters {
  name: string;
  path: string;
}

export const useChaptersStore = defineStore('chapters', () => {
  const chapters = ref<Chapters[]>([]);

  /**
   * 获取 Chapters
   * @param filePath
   */
  async function getChapters(filePath: string, ruleId?: string) {
    chapters.value = [];
    const res = await getChapter(filePath, ruleId).catch(() => {});
    if (res?.code === 0) {
      const rows = res?.data || [];
      chapters.value = rows;
    }
  }

  return {
    getChapters,
    chapters
  };
});

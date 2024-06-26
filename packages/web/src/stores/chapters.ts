import { getChapter } from '@/api';

interface Chapters {
  name: string;
  chapterPath: string;
}

export const useChaptersStore = defineStore('chapters', () => {
  const chapters = ref<Chapters[]>([]);
  let key = '';

  /**
   * 获取 Chapters
   * @param filePath
   */
  async function getChapters(filePath: string, ruleId?: string) {
    const _key = `${filePath}${ruleId}`;
    if (key === _key) return;
    key = _key;
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

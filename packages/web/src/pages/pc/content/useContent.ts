import type { Ref } from 'vue';
import { getContent } from '@/api';
import { useChaptersStore } from '@/stores/chapters';
import { useSettingStore } from '@/stores/setting';
import { useReadStore } from '@/stores/read';
import { useKeyboardShortcuts } from '@/hooks/useMagicKeys';

export function useContent(contentRef: Ref<HTMLElement>) {
  const route = useRoute();
  const router = useRouter();
  const chaptersStore = useChaptersStore();
  const settingStore = useSettingStore();
  const readStore = useReadStore();

  const content = ref('');

  const chapterPath = ref<string>('');

  const lastChapter = computed<string>(() => {
    if (!chapterPath.value) return '';
    const idx = chaptersStore.chapters.findIndex((e: any) => e.chapterPath === chapterPath.value);
    const item: any = idx === 0 ? null : chaptersStore.chapters[idx - 1];
    return item?.chapterPath || '';
  });

  const nextChapter = computed<string>(() => {
    if (!chapterPath.value) return '';
    const idx = chaptersStore.chapters.findIndex((e: any) => e.chapterPath === chapterPath.value) + 1;
    if (idx === 0) return '';
    const item: any = chaptersStore.chapters.length - 1 < idx ? null : chaptersStore.chapters[idx];
    return item?.chapterPath || '';
  });

  // 初始化
  async function init() {
    content.value = '';
    const res = await getContent(route.query).catch(() => {});
    chapterPath.value = route.query.chapterPath as string;
    chaptersStore.getChapters(route.query.filePath as string, route.query.ruleId as string).then(() => {
      const chapterInfo = chaptersStore.chapters.find((e) => e.chapterPath === route.query.chapterPath);
      readStore.setPath(chapterInfo?.chapterPath || '');
      readStore.setTitle(chapterInfo?.name || '');
    });
    if (res?.code === 0) {
      content.value = res?.data?.content || '';
    }
    nextTick(() => {
      contentRef.value.scrollTop = 0;
    });
  }

  // 路由被改变
  watch(() => route.query, init, {
    immediate: true,
    deep: true
  });

  onUnmounted(() => {
    readStore.setPath('');
    readStore.setTitle('');
  });

  function toChapter(chapterPath: string) {
    if (!chapterPath) return;
    router.replace({
      name: route.name as string,
      query: {
        ...route.query,
        chapterPath
      }
    });
  }

  // 上一章
  function onPrevChapter() {
    toChapter(lastChapter.value);
  }

  // 下一章
  function onNextChapter() {
    toChapter(nextChapter.value);
  }

  // 上一页
  function onPageUp() {
    contentRef.value.scrollTop = contentRef.value.scrollTop - contentRef.value.offsetHeight + 5;
  }

  // 下一页
  function onPageDown() {
    contentRef.value.scrollTop = contentRef.value.scrollTop + contentRef.value.offsetHeight - 5;
  }

  // 监听热键
  useKeyboardShortcuts(
    {
      passive: false,
      onEventFired: (e) => {
        e.preventDefault();
      }
    },
    (cmd: string) => {
      const cmdMap: any = {
        prevChapter: onPrevChapter,
        nextChapter: onNextChapter,
        pageUp: onPageUp,
        pageDown: onPageDown
      };
      cmdMap[cmd] && cmdMap[cmd]();
    }
  );

  return {
    settingStore,
    content,
    toChapter
  };
}

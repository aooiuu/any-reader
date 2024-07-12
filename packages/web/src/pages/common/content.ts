import type { Ref } from 'vue';
import { useEventListener } from '@vueuse/core';
import { debounce } from 'lodash-es';
import { getContent } from '@/api';
import { saveChapterHistory } from '@/api/chapterHistory';
import { useChaptersStore } from '@/stores/chapters';
import { useSettingStore } from '@/stores/setting';
import { useReadStore } from '@/stores/read';
import { useKeyboardShortcuts } from '@/hooks/useMagicKeys';

function useSaveHistory(contentRef: Ref<HTMLElement>, options: Ref<any>) {
  const savePercentage = debounce(
    (params: any) => {
      saveChapterHistory(params);
    },
    400,
    {
      maxWait: 30000
    }
  );

  useEventListener(contentRef, 'scroll', () => {
    const { chapterPath, filePath, ruleId } = options.value;
    savePercentage({
      ruleId,
      filePath,
      chapterPath,
      percentage: Math.floor((contentRef.value.scrollTop / contentRef.value.scrollHeight) * 100000)
    });
  });
}

export function useContent(contentRef: Ref<HTMLElement>) {
  const content = ref<string>('');
  const route = useRoute();
  const router = useRouter();
  const chaptersStore = useChaptersStore();
  const settingStore = useSettingStore();
  const readStore = useReadStore();
  const options = computed(() => route.query);

  useSaveHistory(contentRef, options);

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
    const { chapterPath: _chapterPath, filePath, ruleId, percentage } = route.query as Record<string, string>;
    content.value = '';
    const res = await getContent(route.query).catch(() => {});
    chapterPath.value = _chapterPath as string;
    chaptersStore.getChapters(filePath as string, ruleId as string).then(() => {
      const chapterInfo = chaptersStore.chapters.find((e) => e.chapterPath === route.query.chapterPath);
      readStore.setPath(chapterInfo?.chapterPath || '');
      readStore.setTitle(chapterInfo?.name || '');
    });
    if (res?.code === 0) {
      content.value = res?.data?.content || '';
    }
    nextTick(() => {
      let scrollTop = 0;
      if (percentage) {
        scrollTop = contentRef.value.scrollHeight * (+percentage / 100000);
      }
      contentRef.value.scrollTop = scrollTop;
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
        percentage: 0,
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
    contentRef.value.scrollTo({
      top: contentRef.value.scrollTop - contentRef.value.offsetHeight + 5,
      behavior: 'smooth'
    });
  }

  // 下一页
  function onPageDown() {
    contentRef.value.scrollTo({
      top: contentRef.value.scrollTop + contentRef.value.offsetHeight - 5,
      behavior: 'smooth'
    });
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
    toChapter,
    lastChapter,
    nextChapter,
    onPageUp,
    onPageDown,
    onPrevChapter,
    onNextChapter
  };
}

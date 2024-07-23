import { stringify } from 'qs';
import { App } from 'ant-design-vue';
import { ContentType } from '@any-reader/rule-utils';
import { getChapter, getContent } from '@/api';
import { getChapterHistorys } from '@/api/modules/chapter-history';
import { openWindow } from '@/api/modules/electron';
import { useRulesStore } from '@/stores/rules';
import { useFavoritesStore } from '@/stores/favorites';

function useFavorites(params: Record<string, string>) {
  const favoritesStore = useFavoritesStore();

  const isStarred = computed<boolean>(() => {
    const { filePath, ruleId } = params;
    if (!ruleId) return false;
    return favoritesStore.starred({ url: filePath, ruleId });
  });

  function star() {
    const { ruleId } = params;
    if (!ruleId) return false;
    favoritesStore.star({ ...params, ruleId });
  }

  return {
    favoritesStore,
    isStarred,
    star
  };
}

export function useChapter() {
  const { message } = App.useApp();

  const chaptersRef = ref();
  const route = useRoute();
  const router = useRouter();
  const rulesStore = useRulesStore();

  const ruleId = computed(() => route.query.ruleId);

  const loading = ref(false);
  const list = ref<any[]>([]);
  const historys = ref<any[]>([]);

  async function chapterHistory() {
    const { filePath, ruleId } = route.query;
    const res = await getChapterHistorys({
      ruleId,
      filePath
    });
    const rows = res?.data || [];
    historys.value = rows;
    if (rows.length && rows[0].chapterPath) {
      // const item = list.value.find((l) => l.chapterPath === rows[0].chapterPath);
      // if (item) {
      //   showContent(item);
      // } else {
      chaptersRef.value?.querySelector(`[data-url="${rows[0].chapterPath}"]`)?.scrollIntoView({ behavior: 'smooth' });
      // }
    }
  }

  async function init() {
    list.value = [];
    const { filePath, ruleId } = route.query as Record<string, string>;
    if (!filePath && !ruleId) return;
    loading.value = true;
    const res = await getChapter(filePath, ruleId).catch(() => {});
    loading.value = false;
    if (res?.code === 0) {
      list.value = res?.data || [];
    }
    await chapterHistory();
  }

  onActivated(() => {
    init();
  });

  function findHistory(item: any) {
    return historys.value.find((history) => history.chapterPath === item.chapterPath);
  }

  function isLastRead(item: any) {
    if (!historys.value.length) return false;
    return historys.value[0].chapterPath === item.chapterPath;
  }

  async function showContent(item: any) {
    const { filePath, ruleId, name } = route.query;
    const history = findHistory(item);
    const rule = rulesStore.list.find((e) => e.id === ruleId);
    const params = {
      percentage: history?.percentage ?? 0
    };

    if (rule?.contentType === ContentType.VIDEO) {
      loading.value = true;
      const res = await getContent({
        filePath,
        ruleId,
        chapterPath: item.url || item.chapterPath
      }).catch(() => {});
      loading.value = false;
      const url = res?.data?.content || '';
      if (res?.code === 0 && url) {
        openWindow({
          url:
            '/player?' +
            stringify({
              url,
              name,
              chapterName: item.name
            })
        });
      } else {
        message.warning('获取地址失败！');
      }
      return;
    } else if (rule?.contentType === ContentType.AUDIO) {
      // TODO: 音频规则, 待优化
      const res = await getContent({
        filePath,
        ruleId,
        chapterPath: item.url || item.chapterPath
      }).catch(() => {});
      const url = res?.data?.content || '';
      if (res?.code === 0) {
        openWindow({
          url:
            '/iframe?' +
            stringify({
              url,
              name,
              chapterName: item.name
            })
        });
        return;
      }
    }

    router.push({
      path: '/content',
      query: {
        ...params,
        filePath,
        ruleId,
        chapterPath: item.url || item.chapterPath
      }
    });
  }

  return {
    ruleId,
    showContent,
    findHistory,
    list,
    loading,
    historys,
    chaptersRef,
    isLastRead,
    ...useFavorites(route.query as Record<string, string>)
  };
}

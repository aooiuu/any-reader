/**
 * 章节相关功能模块
 */
import { stringify } from 'qs';
import { App } from 'ant-design-vue';
import { ContentType } from '@any-reader/rule-utils';
import { getChapter, getContent } from '@/api';
import { getChapterHistorys } from '@/api/modules/chapter-history';
import { openWindow } from '@/api/modules/electron';
import { useRulesStore } from '@/stores/rules';
import { useFavoritesStore } from '@/stores/favorites';

/**
 * 收藏相关功能Hook
 * @param params - 路由参数
 * @returns 收藏相关的状态和方法
 */
function useFavorites(params: Record<string, string>) {
  const favoritesStore = useFavoritesStore();

  /**
   * 判断当前内容是否已收藏
   */
  const isStarred = computed<boolean>(() => {
    const { filePath, ruleId } = params;
    if (!ruleId) return false;
    return favoritesStore.starred({ url: filePath, ruleId });
  });

  /**
   * 收藏当前内容
   */
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

/**
 * 章节列表相关功能Hook
 * @returns 章节列表相关的状态和方法
 */
export function useChapter() {
  const { message } = App.useApp();

  const chaptersRef = ref();
  const route = useRoute();
  const router = useRouter();
  const rulesStore = useRulesStore();

  /** 当前规则ID */
  const ruleId = computed(() => route.query.ruleId);

  const loading = ref(false);
  /** 章节列表数据 */
  const list = ref<any[]>([]);
  /** 阅读历史数据 */
  const historys = ref<any[]>([]);

  /**
   * 获取章节阅读历史
   */
  async function chapterHistory() {
    const { filePath, ruleId } = route.query;
    const res = await getChapterHistorys({
      ruleId,
      filePath
    });
    const rows = res?.data || [];
    historys.value = rows;
    if (rows.length && rows[0].chapterPath) {
      chaptersRef.value?.querySelector(`[data-url="${rows[0].chapterPath}"]`)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * 初始化章节列表数据
   */
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

  /**
   * 查找章节的阅读历史记录
   * @param item - 章节项
   * @returns 历史记录项
   */
  function findHistory(item: any) {
    return historys.value.find((history) => history.chapterPath === item.chapterPath);
  }

  /**
   * 判断是否为最后阅读的章节
   * @param item - 章节项
   * @returns 是否为最后阅读
   */
  function isLastRead(item: any) {
    if (!historys.value.length) return false;
    return historys.value[0].chapterPath === item.chapterPath;
  }

  /**
   * 显示章节内容
   * @param item - 章节项
   */
  async function showContent(item: any) {
    const { filePath, ruleId, name } = route.query;
    const history = findHistory(item);
    const rule = rulesStore.list.find((e) => e.id === ruleId);
    const params = {
      percentage: history?.percentage ?? 0
    };

    // 处理视频类型内容
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
    }
    // 处理音频类型内容
    // TODO: 音频规则, 待优化
    else if (rule?.contentType === ContentType.AUDIO) {
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

    // 处理其他类型内容
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

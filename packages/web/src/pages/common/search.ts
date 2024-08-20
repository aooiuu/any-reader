import { v4 as uuidV4 } from 'uuid';
import pLimit from 'p-limit';
import { ContentType } from '@any-reader/rule-utils';
import { searchByRuleId } from '@/api';
import { useRulesStore } from '@/stores/rules';

export function useSearch() {
  const rulesStore = useRulesStore();

  const route = useRoute();
  const router = useRouter();

  let uuid: string = '';
  const searchText = ref('');
  const contentType = ref(ContentType.NOVEL);
  const contentTypes = computed(() => [contentType.value]);
  const loading = ref(false);
  const total = ref(0);
  const runCount = ref(0);

  const list = ref<any[]>([]);

  async function onSearch(uid?: string) {
    const runPromise = pLimit(10);
    const lastUuid = uid || uuidV4();
    uuid = lastUuid;
    list.value = [];
    total.value = 0;
    runCount.value = 0;
    loading.value = true;
    const rules = rulesStore.list.filter((e) => contentTypes.value.includes(e.contentType) && e.enableSearch);
    total.value = rules.length;

    const tasks = rules.map((rule) =>
      runPromise(() => {
        return new Promise((c) => {
          if (lastUuid !== uuid) return;
          runCount.value++;
          searchByRuleId({ ruleId: rule.id, keyword: searchText.value })
            .then((res) => {
              if (res.code === 0) {
                const rows = res.data;
                if (!rows.length) return;
                list.value.push({
                  rule: rule,
                  list: rows
                });
              }
            })
            .finally(() => c(true));
        });
      })
    );
    await Promise.all(tasks).catch(() => {});
    loading.value = false;
  }

  function cancelSearch() {
    uuid = uuidV4();
    loading.value = false;
  }

  function init() {
    const { keyword, _uuid } = route.query;
    if (searchText.value === keyword && uuid === _uuid) return;
    if (keyword) {
      searchText.value = keyword as string;
      onSearch(_uuid as string);
    }
  }

  onMounted(init);
  onActivated(init);
  onDeactivated(cancelSearch);

  function getChapter(row: any, rule: any) {
    router.push({
      path: '/chapter',
      query: {
        ...row,
        filePath: row.url,
        ruleId: rule.id
      }
    });
  }

  return {
    getChapter,
    contentType,
    cancelSearch,
    searchText,
    onSearch,
    loading,
    runCount,
    total,
    list
  };
}

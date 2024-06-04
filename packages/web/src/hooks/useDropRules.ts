import { createRule } from '@/api';
import { readFile } from '@/utils/file';
import { isRule } from '@/utils/rule';
import { useRulesStore } from '@/stores/rules';

export function useDropRules(cb: { ({ count }: { count: any }): void; (arg0: { count: number }): void }) {
  const rulesStore = useRulesStore();
  const loading = ref(false);

  async function drop(event: { preventdefault: () => void; dataTransfer: { files: any } }) {
    // vscode
    if (typeof event.preventdefault === 'function') event.preventdefault();
    const files = event.dataTransfer.files;
    loading.value = true;
    for (const file of files) {
      await dropFile(file);
    }
    loading.value = false;
  }
  async function dropFile(file: Blob) {
    let count = 0;
    const rules = await readFile(file);
    for (const rule of rules) {
      if (isRule(rule)) {
        await createRule(rule);
        count++;
      }
    }
    rulesStore.sync();
    cb({ count });
  }

  return { drop, dropFile, loading };
}

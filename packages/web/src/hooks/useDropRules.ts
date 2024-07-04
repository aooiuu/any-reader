import { createRule, importRules, importCMS } from '@/api';
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
    const rules: any = await readFile(file);
    if (Array.isArray(rules)) {
      for (const rule of rules) {
        if (isRule(rule)) {
          if (typeof rule === 'string') {
            await importRules({ url: rule });
          } else {
            await createRule(rule);
          }
          count++;
        }
      }
    } else if (typeof rules === 'object' && Array.isArray(rules.tbl_site)) {
      for (const site of rules.tbl_site) {
        //  0:cms(xml) 1:cms(json) 2:drpy 3:app(v3) 4:app(v1)
        if ([0, 1].includes(site.type)) {
          await importCMS({
            type: ['maccms.xml', 'maccms.json'][site.type],
            name: site.name,
            api: site.api
          });
          count++;
        }
      }
    }

    rulesStore.sync();
    cb({ count });
  }

  return { drop, dropFile, loading };
}

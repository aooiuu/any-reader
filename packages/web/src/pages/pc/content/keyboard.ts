import type { UseMagicKeysOptions } from '@vueuse/core';
import { useMagicKeys } from '@/hooks/useMagicKeys';
import { useSettingStore } from '@/stores/setting';

type KeyboardEvent = 'prevChapter' | 'nextChapter' | 'pageUp' | 'pageDown';

// 监听热键
export function useKeyboard(options: UseMagicKeysOptions<false> | undefined, cb: (arg: KeyboardEvent) => {}) {
  const settingStore = useSettingStore();
  const { keyText } = useMagicKeys(options);

  const settingKeys = Object.keys(settingStore.data.keyboardShortcuts) as KeyboardEvent[];
  watch(keyText, (text) => {
    for (const settingKey of settingKeys) {
      if (settingStore.data.keyboardShortcuts[settingKey] === text) {
        cb(settingKey);
      }
    }
  });
}

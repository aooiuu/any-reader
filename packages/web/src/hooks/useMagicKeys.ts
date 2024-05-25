import { useMagicKeys as _useMagicKeys, type UseMagicKeysOptions } from '@vueuse/core';
import { useSettingStore } from '@/stores/setting';

export function useMagicKeys(option?: UseMagicKeysOptions<false> | undefined) {
  const aliasMap = {
    arrowup: '↑',
    arrowdown: '↓',
    arrowleft: '←',
    arrowright: '→',
    control: 'ctrl'
  };

  const { current } = _useMagicKeys(option);

  // @ts-ignore
  const keyText = computed(() => [...current].map((key) => aliasMap[key] ?? key).join('+'));

  return {
    keyText
  };
}

type KeyboardEvent = 'prevChapter' | 'nextChapter' | 'pageUp' | 'pageDown';

// 监听热键
export function useKeyboardShortcuts(options: UseMagicKeysOptions<false> | undefined, cb: (arg: string) => void) {
  const settingStore = useSettingStore();
  const { keyText } = useMagicKeys(options);

  const settingKeys = Object.keys(settingStore.data.keyboardShortcuts) as KeyboardEvent[];
  watch(keyText, (text) => {
    for (const settingKey of settingKeys) {
      if (settingStore.data.keyboardShortcuts[settingKey] === text) {
        cb(settingKey);
        return;
      }
    }
  });
}

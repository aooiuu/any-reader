import { useMagicKeys as _useMagicKeys, type UseMagicKeysOptions } from '@vueuse/core';

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

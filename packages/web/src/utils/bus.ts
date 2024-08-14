import { useEventBus } from '@vueuse/core';

export const EVENT_CHAPTERS_BOX = Symbol();
export const EVENT_SEARCH_BOX = Symbol();
export const EVENT_TITLE_CHANGE = Symbol();

export function useBus(key: Symbol) {
  return useEventBus(key);
}

import { useEventBus } from '@vueuse/core';

export const EVENT_CHAPTERS_BOX = Symbol();
export const EVENT_SEARCH_BOX = Symbol();

export function useOpenChaptersBox() {
  return useEventBus(EVENT_CHAPTERS_BOX);
}

export function useSearchBox() {
  return useEventBus(EVENT_SEARCH_BOX);
}

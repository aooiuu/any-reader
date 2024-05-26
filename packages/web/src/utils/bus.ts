import { useEventBus } from '@vueuse/core';

export const OPEN_CHAPTERS_BOX = Symbol();

export function useOpenChaptersBox() {
  return useEventBus(OPEN_CHAPTERS_BOX);
}

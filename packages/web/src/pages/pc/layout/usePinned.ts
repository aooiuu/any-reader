import { alwaysOnTop } from '@/api/modules/electron';

export function usePinned() {
  const pinned = ref(false);

  async function changePinned() {
    const res = await alwaysOnTop(!pinned.value).catch(() => {});
    if (res?.code === 0) {
      pinned.value = res.data;
    }
  }

  return {
    pinned,
    changePinned
  };
}

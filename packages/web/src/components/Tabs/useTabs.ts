import type { Ref } from 'vue';

export function useTabs(navsRef: Ref<HTMLElement>) {
  function onWheel(event: WheelEvent) {
    if (event.deltaY > 0) {
      navsRef.value.scrollLeft += 20;
    } else {
      navsRef.value.scrollLeft -= 20;
    }
  }

  function scrollToLeft() {
    navsRef.value.scrollTo({
      left: navsRef.value.scrollLeft - navsRef.value.offsetWidth,
      behavior: 'smooth'
    });
  }

  function scrollToRight() {
    navsRef.value.scrollTo({
      left: navsRef.value.scrollLeft + navsRef.value.offsetWidth,
      behavior: 'smooth'
    });
  }

  return {
    scrollToLeft,
    scrollToRight,
    onWheel
  };
}

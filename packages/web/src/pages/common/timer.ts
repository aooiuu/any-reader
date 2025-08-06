import { useSettingStore } from '@/stores/setting';
/** 启动和销毁计时器 hooks */
export const userTimer = () => {
  const settingStore = useSettingStore();

  const timerId = ref();

  onMounted(() => {
    timerId.value = setInterval(() => {
      settingStore.readTime += 1;
    }, 1000);
  });

  onBeforeUnmount(() => {
    if (timerId.value) {
      clearInterval(timerId.value);
    }
  });
};

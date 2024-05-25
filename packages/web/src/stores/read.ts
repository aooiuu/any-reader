export const useReadStore = defineStore('read', () => {
  const title = ref<string>('');
  const path = ref<string>('');

  function setTitle(val: string) {
    title.value = val;
  }

  function setPath(val: string) {
    path.value = val;
  }

  return { title, path, setTitle, setPath };
});

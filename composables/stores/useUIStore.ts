export const useUIStore = defineStore('ui', () => {
  const isChatOpened = ref(false);

  function setIsChatOpened(value: boolean) {
    isChatOpened.value = value;
  }

  return {
    isChatOpened,
    setIsChatOpened,
  };
});
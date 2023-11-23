export const useInputOptionsStore = defineStore('input-options', () => {
  const selectedInputOptionTab = ref({
    index: 1,
    label: 'VueJS',
  });
  const selectedInputOption = ref('Composition API');

  function setSelectedInputOptionTab(value: string, inputOptionTabs: any) {
    selectedInputOptionTab.value.label = value;
    selectedInputOptionTab.value.index = inputOptionTabs.value.findIndex((tab: any) => tab.label === value);
  }
  function setSelectedInputOption(value: string) {
    selectedInputOption.value = value;
  }

  return {
    selectedInputOptionTab,
    selectedInputOption,
    setSelectedInputOptionTab,
    setSelectedInputOption,
  }
});
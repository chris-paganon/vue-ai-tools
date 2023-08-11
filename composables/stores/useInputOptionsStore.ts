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

  function askInputQuestion() {
    switch (selectedInputOption.value) {
      case 'PlainGPT':
        useAskQuestion();
        break;
      case 'Composition API':
        useAskFunction();
        break;
      case 'Options API':
        useAskFunction();
        break;
      default:
        useAskFunction();
        break;
    }
  }

  return {
    selectedInputOptionTab,
    selectedInputOption,
    setSelectedInputOptionTab,
    setSelectedInputOption,
    askInputQuestion,
  }
});
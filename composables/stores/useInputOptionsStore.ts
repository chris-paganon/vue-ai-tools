export const useInputOptionsStore = defineStore('input-options', () => {
  const selectedInputOptionTab = ref('VueJS');
  const selectedInputOption = ref('Composition API');

  function setSelectedInputOptionTab(value: string) {
    selectedInputOptionTab.value = value;
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
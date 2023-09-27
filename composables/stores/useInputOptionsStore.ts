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
    const { setPlainGptSystemMessage, setCompositionIndexSystemMessage, setOptionsIndexSystemMessage } = useChatStore();
    switch (selectedInputOption.value) {
      case 'PlainGPT':
        setPlainGptSystemMessage();
        useAskQuestion();
        break;
      case 'Composition API':
        setCompositionIndexSystemMessage();
        useAskQuestion();
        break;
      case 'Options API':
        setOptionsIndexSystemMessage();
        useAskQuestion();
        break;
      default:
        setCompositionIndexSystemMessage();
        useAskQuestion();
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
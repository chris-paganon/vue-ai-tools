export const useChatInputStore = defineStore('chat-input', () => {
  const inputQuestion = ref('');
  const isWaitingAnswer = ref(false);

  const selectedInputOptionTab = ref({
    index: 1,
    label: 'VueJS',
  });
  const selectedInputOption = ref('Composition API');

  function setInputQuestion(value: string) {
    inputQuestion.value = value;
  }
  function setIsWaitingAnswer(value: boolean) {
    isWaitingAnswer.value = value;
  }
  function setSelectedInputOptionTab(value: string, inputOptionTabs: any) {
    selectedInputOptionTab.value.label = value;
    selectedInputOptionTab.value.index = inputOptionTabs.value.findIndex(
      (tab: any) => tab.label === value
    );
  }
  function setSelectedInputOption(value: string) {
    selectedInputOption.value = value;
  }

  return {
    inputQuestion,
    isWaitingAnswer,
    selectedInputOptionTab,
    selectedInputOption,
    setInputQuestion,
    setIsWaitingAnswer,
    setSelectedInputOptionTab,
    setSelectedInputOption,
  };
});

export const useChatStore = defineStore('chat', () => {
  const inputQuestion = ref('');

  function setInputQuestion(value: string) {
    inputQuestion.value = value;
  }

  return {
    inputQuestion,
    setInputQuestion,
  };
});
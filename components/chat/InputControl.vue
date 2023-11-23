<template>
  <ChatToolBar />
  <div class="flex flex-column md:flex-row justify-content-between gap-3 mt-0 mb-3">
    <Textarea v-model="inputQuestion" @keydown.enter="askQuestion($event)" autoResize rows="2" class="md:w-10" />
    <Button @click="askQuestion()" :loading="isWaitingAnswer" label="Ask" size="large" class="flex-grow-1" />
  </div>
</template>

<script setup lang="ts">
const { setIsChatOpened } = useUIStore();
const { addUserMessage, addAssistantMessage } = useChatStore();
const { inputQuestion, isWaitingAnswer, selectedInputOption } = storeToRefs(useChatInputStore());
const { setInputQuestion, setIsWaitingAnswer } = useChatInputStore();

async function askInputQuestion() {
  const { setPlainGptSystemMessage, setCompositionIndexSystemMessage, setOptionsIndexSystemMessage } = useChatStore();
  switch (selectedInputOption.value) {
    case 'PlainGPT':
      setPlainGptSystemMessage();
      return await useAskQuestion();
    case 'Composition API':
      setCompositionIndexSystemMessage();
      return await useAskFunction();
    case 'Options API':
      setOptionsIndexSystemMessage();
      return await useAskFunction();
    default:
      setCompositionIndexSystemMessage();
      return await useAskFunction();
  }
}

async function askQuestion(event?: KeyboardEvent) {
  // Keep writing if shift+enter is pressed
  if(event?.shiftKey) return;
  // If only enter is pressed, we do not add newline and we send the question
  event?.preventDefault();

  setIsChatOpened(true);
  if (!inputQuestion.value) return;

  addUserMessage(inputQuestion.value);
  setIsWaitingAnswer(true);
  setInputQuestion('');
  const assistantAnswer = await askInputQuestion();
  if (!assistantAnswer) {
    setIsWaitingAnswer(false);
    return;
  };

  addAssistantMessage(assistantAnswer);
  setIsWaitingAnswer(false);
}
</script>
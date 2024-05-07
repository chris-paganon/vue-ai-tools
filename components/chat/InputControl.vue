<template>
  <ChatToolBar />
  <div
    class="flex flex-column md:flex-row justify-content-between gap-3 mt-0 mb-3 p-input-filled"
  >
    <Textarea
      v-model="inputQuestion"
      auto-resize
      rows="2"
      class="md:w-10"
      @keydown.enter="askQuestion($event)"
    />
    <Button
      :loading="isWaitingAnswer"
      label="Ask"
      size="large"
      class="flex-grow-1"
      @click="askQuestion()"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  openChatDialog: {
    type: Boolean,
    default: false,
  },
});

const { setIsChatOpened } = useUIStore();
const { addUserMessage, addAssistantMessage } = useChatStore();
const { inputQuestion, isWaitingAnswer, selectedInputOption } =
  storeToRefs(useChatInputStore());
const { setInputQuestion, setIsWaitingAnswer } = useChatInputStore();

async function askInputQuestion() {
  const {
    setPlainGptSystemMessage,
    setCompositionIndexSystemMessage,
    setOptionsIndexSystemMessage,
  } = useChatStore();
  switch (selectedInputOption.value) {
    case 'PlainGPT':
      setPlainGptSystemMessage();
      return await useAskQuestion();
    case 'Composition API':
      setCompositionIndexSystemMessage();
      return await useAskAssistant();
    case 'Options API':
      setOptionsIndexSystemMessage();
      return await useAskAssistant();
    default:
      setCompositionIndexSystemMessage();
      return await useAskAssistant();
  }
}

async function askQuestion(event?: KeyboardEvent) {
  // Keep writing if shift+enter is pressed
  if (event?.shiftKey) return;
  // If only enter is pressed, we do not add newline and we send the question
  event?.preventDefault();

  if (props.openChatDialog) {
    setIsChatOpened(true);
  }
  if (!inputQuestion.value) return;

  addUserMessage(inputQuestion.value);
  setIsWaitingAnswer(true);
  setInputQuestion('');
  const assistantAnswer = await askInputQuestion();
  if (!assistantAnswer) {
    setIsWaitingAnswer(false);
    return;
  }

  addAssistantMessage(assistantAnswer);
  setIsWaitingAnswer(false);
}
</script>

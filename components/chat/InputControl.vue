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

const toast = useToast();
const { setIsChatOpened } = useUIStore();
const { addUserMessage, streamAssistantMessage } = useChatStore();
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
    case 'Basic questions':
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
  try {
    const streamedAssistantAnswer = await askInputQuestion();
    if (!streamedAssistantAnswer) {
      throw new Error('No answer from the assistant');
    }
    // TODO: Fix useAskAssistant to also stream answers
    streamAssistantMessage(streamedAssistantAnswer);
  } catch (_) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while asking the question, try again later.',
    });
  } finally {
    setIsWaitingAnswer(false);
  }
}
</script>

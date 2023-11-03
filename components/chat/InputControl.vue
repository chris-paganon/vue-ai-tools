<template>
  <ChatToolBar />
  <div class="flex flex-column md:flex-row justify-content-between gap-3 mt-0 mb-3">
    <Textarea v-model="inputQuestion" @keydown.enter="askQuestion($event)" autoResize rows="2" class="md:w-10" />
    <Button @click="askQuestion()" :loading="isWaitingAnswer" label="Ask" size="large" class="flex-grow-1" />
  </div>
</template>

<script setup lang="ts">
const { inputQuestion, isWaitingAnswer } = storeToRefs(useChatStore());
const { setInputQuestion, setIsWaitingAnswer } = useChatStore();
const { setIsChatOpened } = useUIStore();
const { addUserMessage } = useChatStore();
const { askInputQuestion } = useInputOptionsStore();

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
  askInputQuestion();
}
</script>
<template>
  <div class="flex flex-column md:flex-row justify-content-between gap-3 my-3">
    <Textarea v-model="inputQuestion" @keydown.enter="askQuestion($event)" autoResize rows="2" class="md:w-10" />
    <Button @click="askQuestion()" label="Ask" size="large" class="flex-grow-1" />
  </div>
</template>

<script setup lang="ts">
const inputQuestion = useInputQuestion();
const isChatOpened = useIsChatOpened();

function askQuestion(event?: KeyboardEvent) {
  // Keep writing if shift+enter is pressed
  if(event?.shiftKey) return;
  // If only enter is pressed, we do not add newline and we send the question
  event?.preventDefault();

  isChatOpened.value = true;
  useAskQuestion(inputQuestion.value);
}
</script>
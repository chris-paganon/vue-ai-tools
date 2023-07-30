<template>
  <div class="flex justify-content-between gap-3 my-3">
    <InputText v-model="inputQuestion" @keyup.enter="askQuestion()" type="text" placeholder="What is the composition API?" class="w-10" />
    <Button @click="askQuestion()" label="Ask" size="large" class="flex-grow-1" />
  </div>
</template>

<script setup lang="ts">
const inputQuestion = useInputQuestion();
const isChatOpened = useIsChatOpened();

const askQuestion = () => {
  isChatOpened.value = true;
  useAskQuestion(inputQuestion.value);
}
</script>
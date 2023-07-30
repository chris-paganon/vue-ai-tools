<template>
  <section class="max-w-1024 mx-auto px-4 pb-6">
    <h3 class="text-xl">Enter your VueJS questions here:</h3>
    <div class="flex justify-content-between gap-3 my-3">
      <InputText v-model="inputQuestion" type="text" placeholder="What is the composition API?" class="w-10" />
      <Button @click="askQuestion" label="Ask" size="large" class="flex-grow-1" />
    </div>
  </section>
</template>

<script setup lang="ts">
const inputQuestion = ref('');

const askQuestion = () => {
  useAskQuestion(inputQuestion.value);
}
</script>
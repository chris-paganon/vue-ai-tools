<template>
  <div>
    <h1>Welcome to VueJS AI Tools!</h1>
    <p>Harness the power of Artificial Intelligence to supercharge your VueJS development journey. Our cutting-edge chatbot is finely tuned to provide you with quick and accurate answers to all your VueJS documentation queries. Whether you're a seasoned VueJS developer or just starting out, our AI chatbot is here to assist you every step of the way.</p>
    <h2>Ask and discover with ease! Enter your VueJS questions here, and let our AI-powered chatbot provide you with swift and accurate answers from the VueJS documentation.</h2>
    <div class="my-3">
      <InputText v-model="inputQuestion" type="text" placeholder="What is the composition API" class="w-10" />
      <Button label="Ask" size="large" class="ml-2" />
    </div>
  </div>
</template>

<script setup lang="ts">
const inputQuestion = ref('');
</script>
<template>
  <main>
    <section class="hero-banner h-16rem relative">
      <div class="hero-banner-overlay absolute w-full h-full flex flex-column justify-content-center align-items-center">
        <h1>Welcome to VueTools.ai!</h1>
        <h2 class="text-2xl ">Your Virtual VueJS Documentation Guru</h2>
      </div>
    </section>
    <section class="content py-8 px-4">
      <p class="mb-6">Harness the power of Artificial Intelligence to supercharge your VueJS development journey. Our cutting-edge chatbot is finely tuned to provide you with quick and accurate answers to all your VueJS documentation queries. Whether you're a seasoned VueJS developer or just starting out, our AI chatbot is here to assist you every step of the way.</p>
      <h3 class="text-xl">Enter your VueJS questions here:</h3>
      <div class="flex justify-content-between gap-3 my-3">
        <InputText v-model="inputQuestion" type="text" placeholder="What is the composition API?" class="w-10" />
        <Button label="Ask" size="large" class="flex-grow-1" />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const inputQuestion = ref('');
</script>

<style scoped>
.hero-banner {
  background-image: url('vuejs-banner.jpg');
  background-size: cover;
  background-position: center top;
}
.hero-banner-overlay {
  background-color: rgba(0, 0, 0, 0.6);
}
.content {
  max-width: 1024px;
}
</style>
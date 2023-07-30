<template>
  <h3 class="text-xl">Enter your VueJS questions here:</h3>
  <section class="flex justify-content-between gap-3 my-3">
    <InputText v-model="inputQuestion" type="text" placeholder="What is the composition API?" class="w-10" />
    <Button label="Ask" size="large" class="flex-grow-1" />
  </section>
</template>
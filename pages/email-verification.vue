<template>
  <div
    class="flex flex-column justify-content-center align-items-center h-full"
  >
    <h1>Enter your code below</h1>
    <p>You should have received an email with a code to verify your email.</p>
    <InputOtp
      v-model="otpCode"
      class="my-4"
      integer-only
      :length="8"
      variant="filled"
      @keyup.enter="submit"
    />
    <Button @click="submit">Submit</Button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const otpCode = ref('');

async function submit() {
  console.log(otpCode.value);
}
</script>

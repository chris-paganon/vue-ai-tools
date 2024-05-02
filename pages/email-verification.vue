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
    <p class="mt-4 mb-2">You haven't received your code or it has expired:</p>
    <Button outlined @click="sendCode">Resend code</Button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FetchError } from 'ofetch';

const toast = useToast();
const otpCode = ref('');

async function submit() {
  try {
    await $fetch('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ otpCode: otpCode.value }),
    });
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Your email has been verified',
    });
    navigateTo('/account');
    otpCode.value = '';
  } catch (error) {
    if (error instanceof FetchError) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: error.data.statusMessage,
      });
      return;
    }
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'There was an error verifying your email',
    });
  }
}

async function sendCode() {
  await $fetch('/api/auth/send-email-code');
  toast.add({
    severity: 'info',
    summary: 'Info',
    detail: 'Please check your email for a new code',
  });
}
</script>

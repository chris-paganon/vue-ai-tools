<template>
  <div
    class="flex-grow-1 flex flex-column justify-content-center align-items-center mx-2"
  >
    <Card
      :pt="{
        title: 'text-center',
        content: 'flex flex-column align-items-center',
      }"
    >
      <template #title>Enter your code below</template>
      <template #content>
        <p>
          You should have received an email with a code to verify your email.
        </p>
        <InputOtp
          v-model="otpCode"
          class="my-4"
          integer-only
          :length="8"
          variant="filled"
          @keyup.enter="submit"
        />
        <Button @click="submit">Submit</Button>
        <p class="mt-4 mb-2">
          You haven't received your code or it has expired:
        </p>
        <Button outlined @click="sendCode">Resend code</Button>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { FetchError } from 'ofetch';

definePageMeta({
  layout: 'home',
});

const toast = useToast();
const otpCode = ref('');

onMounted(() => {
  toast.add({
    severity: 'info',
    summary: 'Info',
    detail: 'Please check your email to verify your account',
  });
});

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

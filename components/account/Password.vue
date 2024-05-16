<template>
  <form class="my-4">
    <p class="mb-4">
      Request a password reset: we will send you an email with a link to reset
      your password.
    </p>
    <Button
      label="Request password reset"
      outlined
      :loading="isRequestPasswordResetLoading"
      @click="modifyPassword"
    />
  </form>
</template>

<script setup lang="ts">
import { FetchError } from 'ofetch';

const toast = useToast();

const isRequestPasswordResetLoading = ref(false);

async function modifyPassword() {
  try {
    isRequestPasswordResetLoading.value = true;
    await $fetch('/api/auth/request-password-reset', {
      method: 'POST',
    });
    toast.add({
      severity: 'success',
      summary: 'Password reset requested',
      detail: 'Please check your inbox for a password reset link',
    });
  } catch (error) {
    if (!(error instanceof FetchError)) {
      toast.add({
        severity: 'error',
        summary: 'Password reset failed',
        detail:
          'There is an unknown error in the system. Please try again later.',
      });
      return;
    }
    toast.add({
      severity: 'error',
      summary: 'Password reset failed',
      detail: error.data.statusMessage,
    });
  } finally {
    isRequestPasswordResetLoading.value = false;
  }
}
</script>

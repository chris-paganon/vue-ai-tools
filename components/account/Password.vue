<template>
  <form class="my-4">
    <p class="mb-4">
      Request a password reset: we will send you an email with a link to reset
      your password.
    </p>
    <Button
      label="Request password reset"
      outlined
      @click="modifyPassword"
      :loading="isRequestPasswordResetLoading"
    />
  </form>
</template>

<script setup lang="ts">
import { ClientResponseError } from 'pocketbase';
import { useToast } from 'primevue/usetoast';

const { $pb } = useNuxtApp();
const toast = useToast();

const isRequestPasswordResetLoading = ref(false);

async function modifyPassword() {
  try {
    isRequestPasswordResetLoading.value = true;
    await $pb
      .collection('users')
      .requestPasswordReset($pb.authStore.model?.email);
    toast.add({
      severity: 'success',
      summary: 'Password reset requested',
      detail: 'Please check your inbox for a password reset link',
    });
  } catch (error) {
    if (!(error instanceof Error)) {
      toast.add({
        severity: 'error',
        summary: 'Password reset failed',
        detail:
          'There is an unknown error in the system. Please try again later.',
      });
      return;
    }
    if (!(error instanceof ClientResponseError)) {
      toast.add({
        severity: 'error',
        summary: 'Password reset failed',
        detail: error.message,
      });
      return;
    }
    if (error.response?.data?.email?.message) {
      toast.add({
        severity: 'error',
        summary: 'Password reset failed',
        detail: error.response.data.email.message,
      });
      return;
    }
    toast.add({
      severity: 'error',
      summary: 'Password reset failed',
      detail: error.message,
    });
  } finally {
    isRequestPasswordResetLoading.value = false;
  }
}
</script>

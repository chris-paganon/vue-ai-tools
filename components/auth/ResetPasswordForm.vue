<template>
  <form class="flex flex-column gap-2" @submit="modifyPassword">
    <div class="flex flex-column gap-2">
      <label for="email">Email</label>
      <InputText id="email" v-model="email" @keyup.enter="modifyPassword" />
    </div>
    <Button
      label="Send password reset email"
      class="mt-4"
      :loading="isRequestPasswordResetLoading"
      @click="modifyPassword"
    />
    <Button
      label="Cancel"
      outlined
      class="mt-2"
      @click="$emit('cancelPassordReset')"
    />
    <Message v-if="errorMessage" severity="error">{{ errorMessage }}</Message>
  </form>
</template>

<script setup lang="ts">
import { FetchError } from 'ofetch';

const emit = defineEmits<{
  cancelPassordReset: [];
  passwordResetSuccess: [];
}>();

const toast = useToast();

const email = ref('');
const isRequestPasswordResetLoading = ref(false);
const errorMessage = ref('');

async function modifyPassword() {
  errorMessage.value = '';
  try {
    isRequestPasswordResetLoading.value = true;
    await $fetch('/api/auth/request-password-reset', {
      method: 'POST',
      body: JSON.stringify({ email: email.value }),
    });
    toast.add({
      severity: 'success',
      summary: 'Password reset requested',
      detail: 'Please check your inbox for a password reset link',
    });
    emit('passwordResetSuccess');
  } catch (error) {
    if (!(error instanceof FetchError)) {
      errorMessage.value =
        'There is an unknown error in the system. Please try again later.';
      return;
    }
    errorMessage.value = error.data.statusMessage;
  } finally {
    isRequestPasswordResetLoading.value = false;
  }
}
</script>

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
import { ClientResponseError } from 'pocketbase';
import { useToast } from 'primevue/usetoast';

const emit = defineEmits<{
  cancelPassordReset: [];
  passwordResetSuccess: [];
}>();

const { $pb } = useNuxtApp();
const toast = useToast();

const email = ref('');
const isRequestPasswordResetLoading = ref(false);
const errorMessage = ref('');

async function modifyPassword() {
  errorMessage.value = '';
  try {
    isRequestPasswordResetLoading.value = true;
    await $pb.collection('users').requestPasswordReset(email.value);
    toast.add({
      severity: 'success',
      summary: 'Password reset requested',
      detail: 'Please check your inbox for a password reset link',
    });
    emit('passwordResetSuccess');
  } catch (error) {
    if (!(error instanceof Error)) {
      errorMessage.value =
        'There is an unknown error in the system. Please try again later.';
      return;
    }
    if (!(error instanceof ClientResponseError)) {
      errorMessage.value = error.message;
      return;
    }
    if (error.response?.data?.email?.message) {
      errorMessage.value = error.response.data.email.message;
      return;
    }
    errorMessage.value = error.message;
  } finally {
    isRequestPasswordResetLoading.value = false;
  }
}
</script>

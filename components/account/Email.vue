<template>
  <div class="flex align-items-center gap-2">
    <p class="py-3">My email: {{ user?.email }}</p>
    <Button
      v-if="!isModifyingEmail"
      icon="pi pi-pencil"
      text
      rounded
      @click="isModifyingEmail = true"
    />
  </div>
  <form v-if="isModifyingEmail" class="flex flex-column gap-4 mb-4">
    <label for="new-email" class="flex flex-column">
      My new email:
      <InputText id="new-email" v-model="newEmail" @keyup.enter="modifyEmail" />
    </label>
    <label for="password" class="flex flex-column">
      Confirm password:
      <Password
        id="password"
        v-model="password"
        toggle-mask
        :feedback="false"
        @keyup.enter="modifyEmail"
      />
    </label>
    <div class="flex flex-wrap gap-2">
      <Button
        label="Request email modification"
        :loading="isRequestEmailChangeLoading"
        @click="modifyEmail"
      />
      <Button
        label="Cancel"
        outlined
        :loading="isRequestEmailChangeLoading"
        @click="isModifyingEmail = false"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { FetchError } from 'ofetch';

const { user } = useAuthStore();
const toast = useToast();

const newEmail = ref('');
const password = ref('');

const isModifyingEmail = ref(false);
const isRequestEmailChangeLoading = ref(false);

async function modifyEmail() {
  if (!newEmail.value) {
    toast.add({
      severity: 'error',
      summary: 'Email change failed',
      detail: 'Please enter a new email',
    });
  }
  try {
    isRequestEmailChangeLoading.value = true;
    // TODO: Also modify email in Stripe if Stripe customer exists
    await $fetch('/api/auth/modify-email', {
      method: 'POST',
      body: JSON.stringify({
        newEmail: newEmail.value,
        password: password.value,
      }),
    });
    navigateTo('/email-verification');
    toast.add({
      severity: 'success',
      summary: 'Email change requested',
      detail: 'Please check your inbox for a confirmation email.',
    });
    isModifyingEmail.value = false;
    newEmail.value = '';
    password.value = '';
  } catch (error) {
    if (!(error instanceof FetchError)) {
      toast.add({
        severity: 'error',
        summary: 'Email change failed',
        detail:
          'There is an unknown error in the system. Please try again later.',
      });
      return;
    }
    toast.add({
      severity: 'error',
      summary: 'Email change failed',
      detail: error.data.statusMessage,
    });
  } finally {
    isRequestEmailChangeLoading.value = false;
  }
}
</script>

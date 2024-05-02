<template>
  <div class="flex align-items-center gap-2">
    <p class="py-3">My email: {{ email }}</p>
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
    <div class="flex flex-wrap gap-2">
      <Button
        label="Request email modification"
        @click="modifyEmail"
        :loading="isRequestEmailChangeLoading"
      />
      <Button
        label="Cancel"
        outlined
        @click="isModifyingEmail = false"
        :loading="isRequestEmailChangeLoading"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ClientResponseError } from 'pocketbase';
import { useToast } from 'primevue/usetoast';

const { $pb } = useNuxtApp();
const toast = useToast();

const email = ref<string | undefined>($pb.authStore.model?.email);
const newEmail = ref('');

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
    await $pb.collection('users').requestEmailChange(newEmail.value);
    toast.add({
      severity: 'success',
      summary: 'Email change requested',
      detail: 'Please check your inbox for a confirmation email.',
    });
    isModifyingEmail.value = false;
    newEmail.value = '';
  } catch (error) {
    if (!(error instanceof Error)) {
      toast.add({
        severity: 'error',
        summary: 'Email change failed',
        detail:
          'There is an unknown error in the system. Please try again later.',
      });
      return;
    }
    if (!(error instanceof ClientResponseError)) {
      toast.add({
        severity: 'error',
        summary: 'Email change failed',
        detail: error.message,
      });
      return;
    }
    if (error.response?.data?.newEmail?.message) {
      toast.add({
        severity: 'error',
        summary: 'Email change failed',
        detail: error.response.data.newEmail.message,
      });
      return;
    }
    toast.add({
      severity: 'error',
      summary: 'Email change failed',
      detail: error.message,
    });
  } finally {
    isRequestEmailChangeLoading.value = false;
  }
}
</script>

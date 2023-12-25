<template>
	<div class="mx-auto max-w-1024">
		<h1>My account</h1>
		<NuxtLink to="/subscribe">
			<Button label="Subscribe" />
		</NuxtLink>
		<div class="flex align-items-center gap-2">
			<p class="py-3">My email: {{ email }}</p>
			<Button v-if="!isModifyingEmail" icon="pi pi-pencil" text rounded @click="isModifyingEmail = true" />
		</div>
		<form v-if="isModifyingEmail" class="flex flex-column gap-4 mb-4">
			<label for="new-email" class="flex flex-column">
				My new email:
				<InputText id="new-email" v-model="newEmail" @keyup.enter="modifyEmail" />
			</label>
			<div class="flex flex-wrap gap-2">
				<Button label="Request email modification" @click="modifyEmail" :loading="isRequestEmailChangeLoading" />
				<Button label="Cancel" outlined @click="isModifyingEmail = false" :loading="isRequestEmailChangeLoading" />
			</div>
		</form>
		<Divider type="solid" />
		<form class="my-4">
			<p class="mb-4">Request a password reset: we will send you an email with a link to reset your password.</p>
			<Button label="Request password reset" @click="modifyPassword" :loading="isRequestPasswordResetLoading" />
		</form>
	</div>
</template>

<script setup lang="ts">
import { ClientResponseError } from "pocketbase";
import { useToast } from "primevue/usetoast";

const { $pb } = useNuxtApp();
const toast = useToast();

const email: string | undefined = ref($pb.authStore.model?.email);
const isModifyingEmail = ref(false);
const newEmail = ref('');

const isRequestEmailChangeLoading = ref(false);
const isRequestPasswordResetLoading = ref(false);

async function modifyEmail() {
	if (!newEmail.value) {
		toast.add({
			severity: 'error',
			summary: 'Email change failed',
			detail: 'Please enter a new email',
		});
	};
	try {
		isRequestEmailChangeLoading.value = true;
		await $pb.collection('users').requestEmailChange(newEmail.value);
		toast.add({
			severity: 'success',
			summary: 'Email change requested',
			detail: 'Please check your inbox for a confirmation email.',
		});
		isModifyingEmail.value = false;
		newEmail.value = '';
	} catch (error) {
		if (! (error instanceof Error) ) {
			toast.add({
				severity: 'error',
				summary: 'Email change failed',
				detail: 'There is an unknown error in the system. Please try again later.',
			});
			return;
    }
    if (! (error instanceof ClientResponseError) ) {
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

async function modifyPassword() {
	try {
		isRequestPasswordResetLoading.value = true;
		await $pb.collection('users').requestPasswordReset($pb.authStore.model?.email);
		toast.add({
			severity: 'success',
			summary: 'Password reset requested',
			detail: 'Please check your inbox for a password reset link',
		});
	} catch (error) {
		if (! (error instanceof Error) ) {
			toast.add({
				severity: 'error',
				summary: 'Password reset failed',
				detail: 'There is an unknown error in the system. Please try again later.',
			});
			return;
    }
    if (! (error instanceof ClientResponseError) ) {
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

<style scoped>
form {
	max-width: 800px;
}
</style>
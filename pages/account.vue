<template>
	<div class="mx-auto max-w-1024">
		<h1>My account</h1>
		<form class="flex flex-column gap-4 mb-4">
			<p>My email: {{ email }}</p>
			<label for="modify-email" class="flex flex-column">
				Modify email:
				<InputText id="modify-email" v-model="newEmail" @keyup.enter="modifyEmail" />
			</label>
			<Button label="Save new email" @click="modifyEmail" />
		</form>
		<Button label="Modify password" @click="modifyPassword" />
	</div>
</template>

<script setup lang="ts">
import { ClientResponseError } from "pocketbase";
import { useToast } from "primevue/usetoast";

const { $pb } = useNuxtApp();
const toast = useToast();

const email = ref($pb.authStore.model?.email);
const newEmail = ref('');

async function modifyEmail() {
	if (!newEmail.value) {
		toast.add({
			severity: 'error',
			summary: 'Email change failed',
			detail: 'Please enter a new email',
		});
	};
	try {
		await $pb.collection('users').requestEmailChange(newEmail.value);
		toast.add({
			severity: 'success',
			summary: 'Email change requested',
			detail: 'Please check your inbox for a confirmation email',
		});
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
	}
}

async function modifyPassword() {
	try {
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
	}
}
</script>

<style scoped>
form {
	max-width: 800px;
}
</style>
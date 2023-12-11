<template>
	<div class="mx-auto max-w-1024">
		<h1>My account</h1>
		<form class="flex flex-column gap-4">
			<p>My email: {{ email }}</p>
			<label for="modify-email" class="flex flex-column">
				Modify email:
				<InputText id="modify-email" v-model="email" @keyup.enter="modifyEmail" />
			</label>
			<Button label="Save new email" @click="modifyEmail" />
			<label for="modify-password" class="flex flex-column">
				New password:
				<Password id="modify-password" v-model="password" @keyup.enter="modifyPassword" toggleMask :feedback="false"/>
			</label>
			<label for="modify-password-confirm" class="flex flex-column">
				Confirm new password:
				<Password id="modify-password-confirm" v-model="password" @keyup.enter="modifyPassword" toggleMask :feedback="false"/>
			</label>
			<label for="confirm-old-password" class="flex flex-column">
				Confirm old password:
				<Password id="confirm-old-password" v-model="password" @keyup.enter="modifyPassword" toggleMask :feedback="false"/>
			</label>
			<Button id="modify-password-button" label="Save new password" @click="modifyPassword" />
		</form>
	</div>
</template>

<script setup lang="ts">
const { $pb } = useNuxtApp();

const email = ref('');
const password = ref('');

// I need to set the authStore properly in inititateAuth plugin to make pb available globally instead (because this below won't work)
console.log($pb.authStore);

function modifyEmail() {
	console.log('modifyEmail');
}

function modifyPassword() {
	console.log('modifyPassword');
}
</script>

<style scoped>
form {
	max-width: 800px;
}
</style>
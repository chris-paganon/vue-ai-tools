<template>
	<Button @click="openPortalSession()" outlined>Manage my subscription</Button>
</template>

<script setup lang="ts">
async function openPortalSession() {
	try {
		const redirectUrl = await $fetch('/api/createPortalSession', {
			method: 'POST',
		});
		window.location.href = redirectUrl;
	} catch (error) {
		console.error(error);
	}
}
</script>
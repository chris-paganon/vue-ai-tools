<template>
	<div v-if="!isSignedIn" class="flex flex-column sm:flex-row gap-4">
		<Button @click="setIsLoginModalOpened(true)" severity="secondary" outlined label="Login" />
		<Button @click="setIsSignUpModalOpened(true)" label="Sign Up" />
	</div>
</template>

<script setup lang="ts">
const { isSignedIn } = storeToRefs(useAuthStore());
const { setIsSignUpModalOpened, setIsLoginModalOpened } = useUIStore();
</script>
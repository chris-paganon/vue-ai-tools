<template>
	<nav v-if="!isLoadingAuth">
		<AuthLoginButtons />
		<div v-if="isSignedIn" class="flex gap-4">
			<Button @click="logout" link >Log out</Button>
			<NuxtLink to="/dashboard">
				<Button>Dashboard</Button>
			</NuxtLink>
		</div>
	</nav>
</template>

<script setup lang="ts">
const { isSignedIn, isLoadingAuth } = storeToRefs(useAuthStore());
const { logout } = useAuthStore();
</script>
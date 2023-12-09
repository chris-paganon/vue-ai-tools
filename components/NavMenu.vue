<template>
	<nav v-if="!isLoadingAuth">
		<div v-if="!isSignedIn" class="flex gap-4">
			<Button @click="setIsLoginModalOpened(true)" severity="secondary" outlined>Login</Button>
			<Button @click="setIsSignUpModalOpened(true)">Sign Up</Button>
		</div>
		<div v-else class="flex gap-4">
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

const { setIsSignUpModalOpened, setIsLoginModalOpened } = useUIStore();
</script>
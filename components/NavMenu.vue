<template>
	<!-- Desktop menu -->
	<nav v-if="!isLoadingAuth" class="hidden sm:block">
		<AuthLoginButtons />
		<div v-if="isSignedIn" class="flex gap-4">
			<Button @click="logout" link >Log out</Button>
			<NuxtLink to="/dashboard">
				<Button>Dashboard</Button>
			</NuxtLink>
		</div>
	</nav>

	<!-- Mobile menu -->
	<nav class="block sm:hidden">
		<Sidebar v-model:visible="mobileSidebarVisible">
			<template #header>
				<AppLogo />
			</template>
			<div v-if="!isLoadingAuth" class="flex flex-column align-items-center gap-4">
				<AuthLoginButtons />
				<div v-if="isSignedIn" class="flex flex-column align-items-center gap-4 w-full">
					<NuxtLink to="/dashboard" class="w-full">
						<Button label="Dashboard" class="w-full" />
					</NuxtLink>
					<ToolbarChatHistory />
					<Button v-if="isSignedIn" @click="logout" link >Log out</Button>
				</div>
			</div>
		</Sidebar>
		<Button :icon="mobileSidebarVisible ? 'pi pi-times' : 'pi pi-bars'" @click="mobileSidebarVisible = true" />
	</nav>
</template>

<script setup lang="ts">
const { isSignedIn, isLoadingAuth } = storeToRefs(useAuthStore());
const { logout } = useAuthStore();

const mobileSidebarVisible = ref(false);
</script>
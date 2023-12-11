<template>
	<div class="hidden sm:block surface-card py-4 px-1 sm:px-3">
		<div :class="['flex', 'justify-content-between', 'align-items-center', sidebarHeadFlexDirection]">
			<AppLogo />
			<Button :icon="toggleSibarIcon" text rounded severity="secondary" @click="toggleSidebar()" />
		</div>
		<div v-if="showSidebar" id="app-toolbar-content">
			<ToolbarChatHistory />
		</div>
	</div>
</template>

<script setup lang="ts">

const showSidebar = ref(false);
const toggleSibarIcon = computed(() => (showSidebar.value ? 'pi pi-chevron-left' : 'pi pi-chevron-right'));
const sidebarHeadFlexDirection = computed(() => (showSidebar.value ? 'flex-row' : 'flex-column'));

function toggleSidebar() {
	showSidebar.value = !showSidebar.value;
}
</script>

<style scoped>
#app-toolbar-content {
	min-width: 250px;
}
</style>
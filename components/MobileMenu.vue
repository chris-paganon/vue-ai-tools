<template>
  <nav>
    <Sidebar v-model:visible="mobileSidebarVisible">
      <template #header>
        <AppLogo />
      </template>
      <div class="flex flex-column align-items-center gap-4">
        <AuthLoginButtons />
        <div
          v-if="isSignedIn"
          class="flex flex-column align-items-center gap-4 w-full"
        >
          <NuxtLink
            to="/dashboard"
            class="w-full"
            @click="mobileSidebarVisible = false"
          >
            <Button label="Dashboard" class="w-full" />
          </NuxtLink>
          <ToolbarChatHistory />
          <NuxtLink
            to="/account"
            class="w-full"
            @click="mobileSidebarVisible = false"
          >
            <Button
              outlined
              icon="pi pi-user"
              label="My account"
              aria-label="User"
              class="w-full"
            />
          </NuxtLink>
          <Button v-if="isSignedIn" link @click="logout">Log out</Button>
        </div>
      </div>
    </Sidebar>
    <Button
      :icon="mobileSidebarVisible ? 'pi pi-times' : 'pi pi-bars'"
      @click="mobileSidebarVisible = true"
    />
  </nav>
</template>

<script setup lang="ts">
const { isSignedIn } = storeToRefs(useAuthStore());
const { logout } = useAuthStore();

const mobileSidebarVisible = ref(false);
</script>

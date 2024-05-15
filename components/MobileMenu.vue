<template>
  <nav>
    <Sidebar v-model:visible="mobileSidebarVisible">
      <template #header>
        <AppLogo />
      </template>
      <div class="h-full flex flex-column align-items-center gap-4">
        <AuthLoginButtons />
        <div
          v-if="isSignedIn"
          class="min-h-0 flex flex-column align-items-center gap-4 w-full"
        >
          <ToolbarMenu v-model="showMenuContent" class="w-full" />
          <ToolbarChatHistory class="min-h-0 flex flex-column w-full" />
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
const showMenuContent = ref(true);

const { isSignedIn } = storeToRefs(useAuthStore());
const { logout } = useAuthStore();

const mobileSidebarVisible = ref(false);
</script>

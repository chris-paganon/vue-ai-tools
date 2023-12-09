<template>
  <div class="h-full flex flex-column">
    <Card class="flex-grow-1 flex flex-column justify-content-end">
      <template #content>
        <ChatConversation />
      </template>
      <template #footer>
        <ChatInputControl />
      </template>
    </Card>
  </div>
</template>
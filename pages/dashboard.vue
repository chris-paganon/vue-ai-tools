<template>
  <div class="h-full flex flex-column ml-4 mr-2 mb-2">
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
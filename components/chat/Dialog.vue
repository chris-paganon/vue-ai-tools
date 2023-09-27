<template>
  <Dialog 
    v-model:visible="isChatOpened"
    position="bottom" modal :draggable="false" :dismissableMask="true"
    header="Ask me Anything"
    style="width: 95vw; min-height: 85vh; margin-bottom: 2.5vw;"
    contentStyle="display: flex; flex-direction: column; flex-grow: 1;"
  >
    <ChatConversation />
    <template #footer>
      <ChatInputControl />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
const { isChatOpened } = storeToRefs(useUIStore()); // setIsChatOpened in v-model
</script>
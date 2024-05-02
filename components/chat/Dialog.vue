<template>
  <Dialog
    v-model:visible="isChatOpened"
    position="bottom"
    modal
    :draggable="false"
    :dismissable-mask="true"
    header="Ask me Anything"
    style="width: 95vw; min-height: 85vh; margin-bottom: 2.5vw"
    content-style="display: flex; flex-direction: column; flex-grow: 1;"
  >
    <ChatConversation />
    <ChatInputControl />
  </Dialog>
</template>

<script setup lang="ts">
const { isChatOpened } = storeToRefs(useUIStore()); // setIsChatOpened in v-model
</script>

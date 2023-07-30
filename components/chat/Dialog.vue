<template>
  <Dialog 
    v-model:visible="isChatOpened"
    position="bottom" maximizable modal :dismissableMask="true"
    header="Ask me Anything"
    style="min-width: 90vw; min-height: 85vh"
    contentStyle="display: flex; flex-direction: column; flex-grow: 1;"
  >
    <ChatConversation />
    <ControlsChatInput />
  </Dialog>
</template>

<script setup lang="ts">
const isChatOpened = useIsChatOpened();
</script>
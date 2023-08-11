<template>
  <TabMenu :model="inputOptions" />
  <p>You have selected: {{ selectedInputOptionTab }}</p>
</template>

<script setup lang="ts">
import type { MenuItemCommandEvent } from 'primevue/menuitem';

const { selectedInputOptionTab } = storeToRefs(useInputOptionsStore());
const { setSelectedInputOptionTab } = useInputOptionsStore();

const inputOptions = ref([
  {
    label: 'PlainGPT',
    command: selecteInputOptionTab
  },
  {
    label: 'VueJS',
    command: selecteInputOptionTab
  }
]);

function selecteInputOptionTab(event: MenuItemCommandEvent) {
  if (typeof event.item.label !== 'string') return;
  setSelectedInputOptionTab(event.item.label);
}
</script>
<template>
  <TabMenu v-model:activeIndex="selectedInputOptionTab.index" :model="inputOptionTabs" />
  <div class="options-wrapper text-left p-3">
    <div v-if="selectedInputOptionTab.label === 'PlainGPT'"><p>Simply talk to chatGPT</p></div>
    <div v-else-if="selectedInputOptionTab.label === 'VueJS'">
      <SelectButton v-model="selectedInputOption" :options="inputVueOptions" :unselectable="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MenuItemCommandEvent } from 'primevue/menuitem';

const { selectedInputOptionTab, selectedInputOption } = storeToRefs(useInputOptionsStore());
const { setSelectedInputOptionTab, setSelectedInputOption } = useInputOptionsStore();

const inputOptionTabs = ref([
  {
    label: 'PlainGPT',
    command: selecteInputOptionTab
  },
  {
    label: 'VueJS',
    command: selecteInputOptionTab
  }
]);

const inputVueOptions = ref(['Composition API', 'Options API']);

function selecteInputOptionTab(event: MenuItemCommandEvent) {
  if (typeof event.item.label !== 'string') return;
  setSelectedInputOptionTab(event.item.label, inputOptionTabs);

  if (event.item.label === 'PlainGPT') {
    setSelectedInputOption('PlainGPT');
  } else if (event.item.label === 'VueJS') {
    setSelectedInputOption('Composition API');
  }
}
</script>

<style scoped>
.options-wrapper {
  min-height: 80px;
}
</style>
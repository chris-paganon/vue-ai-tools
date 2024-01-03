<template>
  <div class="h-full flex flex-column">
		<h1>Generate a Vue component from a JSON template:</h1>
		<codemirror
			v-model="code"
			placeholder="Code goes here..."
			:style="{ height: '400px' }"
			:autofocus="true"
			:indent-with-tab="true"
			:tab-size="2"
			:extensions="extensions"
			@ready="handleReady"
			@change="console.log('change', $event)"
			@focus="console.log('focus', $event)"
			@blur="console.log('blur', $event)"
		/>
	</div>
</template>

<script setup lang="ts">
import { Codemirror } from 'vue-codemirror';
import { json } from "@codemirror/lang-json";
import { oneDark } from '@codemirror/theme-one-dark'

const code = ref(`{
	"template": {
		"counter": 0,
		"button": "increment"
	},
	"script": {
		"function": "increment"
	}
}`);
const extensions = [json(), oneDark];

const view = shallowRef();

function handleReady(payload: any) {
	view.value = payload.view
}

function getCodemirrorStates() {
	const state = view.value.state
	const ranges = state.selection.ranges
	const selected = ranges.reduce((r: any, range: any) => r + range.to - range.from, 0)
	const cursor = ranges[0].anchor
	const length = state.doc.length
	const lines = state.doc.lines
	// more state info ...
	// return ...
}

</script>
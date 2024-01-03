<template>
  <div class="h-full flex flex-column">
		<h1>Generate a Vue component from a JSON template:</h1>
		<div ref="codeMirrorParent"></div>
	</div>
</template>

<script setup lang="ts">
import { EditorState } from "@codemirror/state"
import { EditorView, basicSetup } from "codemirror"
import { json } from "@codemirror/lang-json";
import { oneDark } from '@codemirror/theme-one-dark'

const codeMirrorParent = ref<HTMLDivElement | null>(null);
const code = ref(`{
	"template": {
		"counter": 0,
		"button": "increment"
	},
	"script": {
		"function": "increment"
	}
}`);
const extensions = [json(), oneDark, basicSetup];

let startState = EditorState.create({
  doc: code.value,
  extensions: extensions
})

onMounted(() => {
	console.log('test', codeMirrorParent.value);
	if (!codeMirrorParent.value) return;
	
	let view = new EditorView({
		state: startState,
		extensions: extensions,
		parent: codeMirrorParent.value
	})
});
</script>
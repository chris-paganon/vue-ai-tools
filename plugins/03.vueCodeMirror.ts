import { basicSetup } from 'codemirror'
import VueCodemirror from 'vue-codemirror'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueCodemirror, {
    autofocus: true,
		disabled: false,
		indentWithTab: true,
		tabSize: 2,
		placeholder: 'Code goes here...',
		extensions: [basicSetup]
  })
})
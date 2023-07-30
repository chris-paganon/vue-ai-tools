import PrimeVue from "primevue/config";
import Button from "primevue/button";
import Menubar from 'primevue/menubar';
import Textarea from 'primevue/textarea';
import Dialog from 'primevue/dialog';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, { ripple: true, inputStyle: 'filled' });
    nuxtApp.vueApp.component("Button", Button);
    nuxtApp.vueApp.component("Menubar", Menubar);
    nuxtApp.vueApp.component("Textarea", Textarea);
    nuxtApp.vueApp.component("Dialog", Dialog);
});
import PrimeVue from "primevue/config";
import Button from "primevue/button";
import Menubar from 'primevue/menubar';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, { ripple: true });
    nuxtApp.vueApp.component("Button", Button);
    nuxtApp.vueApp.component("Menubar", Menubar);
});
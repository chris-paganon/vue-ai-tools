import PrimeVue from "primevue/config";
import Button from "primevue/button";
import Menubar from 'primevue/menubar';
import InputText from 'primevue/inputtext';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, { ripple: true, inputStyle: 'filled' });
    nuxtApp.vueApp.component("Button", Button);
    nuxtApp.vueApp.component("Menubar", Menubar);
    nuxtApp.vueApp.component("InputText", InputText);
});
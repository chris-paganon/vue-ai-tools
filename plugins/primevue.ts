import PrimeVue from "primevue/config";
import Button from "primevue/button";
import Menubar from 'primevue/menubar';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Password from 'primevue/password';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import TabMenu from 'primevue/tabmenu';
import SelectButton from 'primevue/selectbutton';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, { ripple: true, inputStyle: 'filled' });
    nuxtApp.vueApp.component("Button", Button);
    nuxtApp.vueApp.component("Menubar", Menubar);
    nuxtApp.vueApp.component("InputText", InputText);
    nuxtApp.vueApp.component("Textarea", Textarea);
    nuxtApp.vueApp.component("Password", Password);
    nuxtApp.vueApp.component("Dialog", Dialog);
    nuxtApp.vueApp.component("ProgressSpinner", ProgressSpinner);
    nuxtApp.vueApp.component("TabMenu", TabMenu);
    nuxtApp.vueApp.component("SelectButton", SelectButton);
});
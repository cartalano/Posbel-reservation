import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'primeicons/primeicons.css'


import { createApp } from 'vue'
import  pinia  from "@/store/index.js";
import PrimeVue from "primevue/config"
import App from './App.vue'
import router from './router';
import Aura from '@primevue/themes/aura';

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: false,
            cssLayer: false,

        }
    }
});
app.use(pinia)
app.use(router)

app.mount('#app')

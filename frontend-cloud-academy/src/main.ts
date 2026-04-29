import './index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router';
import vuetify from './plugins/vuetify';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(vuetify);

app.mount('#app');

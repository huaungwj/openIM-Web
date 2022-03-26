import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { registerApp } from './global';
import App from './App.vue';
import router from './router';
import 'normalize.css/normalize.css';
import i18n from './lang/i18n';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
registerApp(app);
app.mount('#app');

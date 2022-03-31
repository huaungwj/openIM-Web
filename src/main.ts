import { createApp, ref } from 'vue';
import { createPinia } from 'pinia';
import { registerApp } from './global';
import App from './App.vue';
import router from './router';
import 'normalize.css/normalize.css';
import i18n from './lang/i18n';

const isDark: any = ref<boolean>(
  window.matchMedia('(prefers-color-scheme: dark)').matches
);

/*模式切换听器*/
const listeners = {
  dark: function (mediaQueryList: any) {
    if (mediaQueryList.matches) {
      isDark.value = true;
    }
  },
  light: function (mediaQueryList: any) {
    if (mediaQueryList.matches) {
      isDark.value = false;
    }
  },
};
window.matchMedia('(prefers-color-scheme: dark)').addListener(listeners.dark);
window.matchMedia('(prefers-color-scheme: light)').addListener(listeners.light);

const app = createApp(App);
app.config.globalProperties.$isDark = isDark;
console.log(app.config.globalProperties);

app.use(createPinia());
app.use(router);
app.use(i18n);
registerApp(app);
console.log(app);

app.mount('#app');

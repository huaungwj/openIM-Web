import { createApp, ref } from 'vue';
import { createPinia } from 'pinia';
import { registerApp } from './global/index';
import App from './App.vue';
import router from './router';
import 'normalize.css/normalize.css';
import { i18n } from './locales/index';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

dayjs.extend(relativeTime);

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $day: (date: dayjs.ConfigType) => dayjs.Dayjs;
    $isDark: any;
  }
}

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
app.config.globalProperties.$day = dayjs;

app.use(createPinia());
app.use(router);
app.use(i18n);
registerApp(app);

app.mount('#app');

console.log(app);

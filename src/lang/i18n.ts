import { createI18n } from 'vue-i18n';
import messages from './index';

const i18n = createI18n({
  locale: localStorage.lang || 'en', //默认中文
  messages,
});

export default i18n;

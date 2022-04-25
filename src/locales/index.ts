import { createI18n } from 'vue-i18n';
import messages from './lang/index';

export const i18n = createI18n({
  locale: 'zh-CN',
  fallbackLocale: 'en',
  messages,
});

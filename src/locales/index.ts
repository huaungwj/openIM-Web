import { createI18n } from 'vue-i18n';
import messages from './lang/index';

const LANGUAGE = 'zh-CN';

const getLanguage = () =>
  localStorage.getItem('language')
    ? localStorage.getItem('language')!
    : LANGUAGE;

export const i18n = createI18n({
  locale: getLanguage(),
  fallbackLocale: 'en',
  messages,
});

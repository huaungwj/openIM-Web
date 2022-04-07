// import type { Ref } from 'vue';

declare namespace golbal {
  const $isDark;
  const $day;
  interface Window {
    urlClick: (id: string) => void;
  }
}

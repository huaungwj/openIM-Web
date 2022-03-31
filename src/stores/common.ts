/**
 * @author [黄伟绩]
 * @email [1835773652@qq.com]
 * @create date 2022-03-29 21:25:52
 * @modify date 2022-03-29 21:25:52
 * @desc [description]
 */

import { defineStore, acceptHMRUpdate } from 'pinia';

export const useCommonStore = defineStore({
  id: 'common',
  state: () => ({
    isDark: false,
  }),
  getters: {},
  actions: {
    setIsDark(type: boolean) {
      this.isDark = type;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCommonStore, import.meta.hot));
}

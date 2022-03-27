import { defineStore, acceptHMRUpdate } from 'pinia';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    verificationCode: '', // 验证码
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    changeVeriCode(code: string) {
      this.$patch({
        verificationCode: code,
      });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}

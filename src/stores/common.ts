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
    createGARelayMTpye: 'cancel', // 转发消息和新建群聊模态框当前的状态标识 操作类型 createGroup | forwardMsg | mergeForwardMsg | addGroupMember
    curRelayMsg: [], // 当前需要转发消息的数组
  }),
  getters: {},
  actions: {
    setIsDark(type: boolean) {
      this.isDark = type;
    },
    setcreateGARelayMTpye(type: string) {
      this.createGARelayMTpye = type;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCommonStore, import.meta.hot));
}

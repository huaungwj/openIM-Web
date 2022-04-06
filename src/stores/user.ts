/**
 * 用户状态管理
 * @author [黄伟绩]
 * @email [1835773652@qq.com]
 * @create date 2022-03-28 07:24:59
 * @modify date 2022-03-28 07:24:59
 * @desc [description]
 */
import { defineStore, acceptHMRUpdate } from 'pinia';
import type { FullUserItem, PartialUserItem } from './types/user';
import { im } from '@/tools/index';
import { APIGetAuthToken } from '@/service/user/user';
import { SECRET } from '@/tools/tools';
import { uuid } from '@/tools/im';

const lastUid: string = localStorage.getItem('lastimuid') || '';
const lastUserStore = localStorage.getItem(`${lastUid}userStore`);

export const useUserStore = defineStore({
  id: 'user',
  state: () =>
    lastUserStore
      ? JSON.parse(lastUserStore!)
      : {
          verificationCode: '', // 验证码
          selfInfo: {} as FullUserItem, // 用户信息
          adminToken: '',
          selfInitLoading: true,
        },
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    // 更改验证码
    changeVeriCode(code: string) {
      this.$patch({
        verificationCode: code,
      });
    },
    // 更新 selfInfo 个人信息
    setSelfInfo(value: PartialUserItem) {
      this.selfInfo = Object.assign({}, this.selfInfo, value);
    },
    // adminToken
    setAdminToken(value: string) {
      this.adminToken = value;
    },
    // selfInitLoading
    setSelfInitLoading(value: boolean) {
      this.selfInitLoading = value;
    },
    // 获取用户信息
    async getSelfInfo() {
      this.selfInitLoading = true;
      // 发送请求
      im.getSelfUserInfo()
        .then((res) => {
          this.selfInfo = JSON.parse(res.data);
          this.selfInitLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.selfInitLoading = false;
        });
    },
    //getAdminToken
    async getAdminToken(uid: string) {
      APIGetAuthToken({
        secret: SECRET ?? 'weiChat',
        platform: 8,
        userID: 'openIM123456', // 只有管理员身份才能获取用户在线状态
        operationID: uuid('uuid'),
      }).then((res) => {
        // ws 连接token
        this.adminToken = res.data.token;
      });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}

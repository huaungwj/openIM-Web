/**
 * @author [黄伟绩]
 * @email [1835773652@qq.com]
 * @create date 2022-03-28 07:25:15
 * @modify date 2022-03-28 07:25:15
 * @desc [description]
 */
import { defineStore, acceptHMRUpdate } from 'pinia';
import type { GroupItem } from './types/contacts';
import { im } from '@/tools';
import type {
  FriendItem,
  TotalUserStruct,
  GetGroupMemberParams,
  GroupMemberItem,
  FriendApplicationItem,
  GroupApplicationItem,
  ResItemType,
} from '@/tools/im/types';
import type { BlackItem } from '@/tools/im/types';

const lastUid = localStorage.getItem('lastimuid') || '';
const lastConsStore = localStorage.getItem(`${lastUid}consStore`);

export const useContactsStore = defineStore({
  id: 'contacts',
  state: () =>
    lastConsStore
      ? JSON.parse(lastConsStore!)
      : {
          friendList: [], // 朋友列表
          originList: [],
          groupList: [], // 群组列表
          blackList: [], // 黑名单列表
          recvFriendApplicationList: [], // 好友申请列表
          sentFriendApplicationList: [], // 已发送好友申请的列表
          recvGroupApplicationList: [], // 收到的加入群聊申请列表。
          sentGroupApplicationList: [], // 发出的加入群聊申请列表。
          groupMemberList: [], // 群员列表
          groupInfo: {} as GroupItem, // 群聊信息
          groupMemberLoading: false, // 组成员加载
          member2status: [], // 群员在线状态
          unReadCount: 0, // 未读信息总计
          conPage: 'tC', // contactPage
          newFGList: {}, // 新的好友和新群组的数据
        },
  getters: {},
  actions: {
    // 获取朋友列表
    async getFriendList() {
      // 加载开始
      // this.groupMemberLoading = true;
      im.getFriendList()
        .then((res) => {
          const tmp: FriendItem[] = [];
          // 除去黑名单的朋友
          JSON.parse(res.data).forEach(
            (item: TotalUserStruct) =>
              !item.blackInfo && tmp.push(item.friendInfo!)
          );
          this.friendList = tmp;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 设置朋友列表
    setFriendList(data: FriendItem[]) {
      this.friendList = data;
    },
    // 获取收到的好友申请列表
    async getRecvFriendApplicationList() {
      im.getRecvFriendApplicationList().then((res) => {
        this.recvFriendApplicationList = JSON.parse(res.data);
      });
    },
    // 设置收到的好友申请列表
    setRecvFriendApplicationList(data: FriendApplicationItem) {
      this.recvFriendApplicationList = data;
    },
    // 获取发送的好友的申请列表
    async getSentFriendApplicationList() {
      im.getSendFriendApplicationList().then((res) => {
        this.sentFriendApplicationList = JSON.parse(res.data);
      });
    },
    // 设置发送的好友的申请列表
    setSentFriendApplicationList(data: FriendApplicationItem[]) {
      this.sentFriendApplicationList = data;
    },
    // 获取群组列表
    async getGroupList() {
      im.getJoinedGroupList().then((res) => {
        this.groupList = JSON.parse(res.data);
      });
    },
    // 设置群聊列表
    setGroupList(data: GroupItem) {
      this.groupList = data;
    },
    // 获取收到的入群申请
    async getRecvGroupApplicationList() {
      im.getRecvGroupApplicationList().then((res) => {
        this.recvGroupApplicationList = JSON.parse(res.data);
      });
    },
    // 设置收到的入群申请
    setRecvGroupApplicationList(data: GroupApplicationItem) {
      this.recvGroupApplicationList = data;
    },
    // 获取发出的入群申请
    async getSentGroupApplicationList() {
      im.getSendGroupApplicationList().then((res) => {
        this.sentGroupApplicationList = JSON.parse(res.data);
      });
    },
    // 设置发出的入群申请
    setSentGroupApplicationList(data: GroupApplicationItem) {
      this.sentGroupApplicationList = data;
    },
    // 获取未读消息数量
    async getUnReadCount() {
      im.getTotalUnreadMsgCount().then((res) => {
        this.unReadCount = Number(res.data);
      });
    },
    // 获取黑名单列表
    async getBlackList() {
      im.getBlackList().then((res) => {
        this.blackList = JSON.parse(res.data);
      });
    },
    // 设置黑名单列表
    setBlackList(data: BlackItem[]) {
      this.blackList = data;
    },
    // 设置未读消息数量
    setUnReadCount(value: number) {
      this.unReadCount = value;
    },
    // 获取群聊信息
    async getGroupInfo(gid: string) {
      im.getGroupsInfo([gid])
        .then((res) => {
          this.groupInfo = JSON.parse(res.data)[0];
        })
        .catch((err) => (this.groupInfo = {} as GroupItem));
    },
    // 设置群聊信息
    setGroupInfo(data: GroupItem[]) {
      this.groupInfo = data;
    },
    //获取群成员列表
    async getGroupMemberList(options: GetGroupMemberParams) {
      this.groupMemberLoading = true;
      im.getGroupMemberList(options).then((res) => {
        this.groupMemberList = JSON.parse(res.data);
        this.groupMemberLoading = false;
      });
    },
    // 设置群员列表
    setGroupMemberList(data: GroupMemberItem[]) {
      this.groupMemberList = data;
    },
    // 设置在线状态
    setMember2status(data: ResItemType[]) {
      this.member2status = data;
    },

    // 切换页面
    togglePage(page: string) {
      this.conPage = page;
    },
    // 设置新好友的数据
    setNewFGList(data: any) {
      this.newFGList = data;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useContactsStore, import.meta.hot));
}

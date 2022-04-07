/**
 * 会话列表 state
 * @author [黄伟绩]
 * @email [1835773652@qq.com]
 * @create date 2022-03-27 21:43:33
 * @modify date 2022-03-27 21:43:33
 * @desc [description]
 */
import { defineStore, acceptHMRUpdate } from 'pinia';
import type { ConversationItem, MessageItem } from '@/tools/im/types';
import { im } from '@/tools';

const lastUid = localStorage.getItem('lastimuid') || '';
const lastCveStore = localStorage.getItem(`${lastUid}cveStore`);
let tmp: any;
if (lastCveStore) {
  const tmp = JSON.parse(lastCveStore!);
  tmp.curCve = null; // 当前会话清空
}

export const useCveStore = defineStore({
  id: 'cve',
  state: () =>
    lastCveStore
      ? tmp
      : {
          cves: [], // 会话列表
          curCve: null, // 当前使用的会话列表
          cveInitLoading: true, // 初始加载
          historyMsgList: [], // 历史消息
        },
  getters: {},
  actions: {
    // 获取会话列表
    async getCveList() {
      // loading开启
      this.cveInitLoading = true;
      im.getAllConversationList()
        .then((res) => {
          this.cves = JSON.parse(res.data);
          this.cveInitLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.cveInitLoading = false;
        });
    },
    // 设置当前会话的数据
    setCurCve(value: ConversationItem | null) {
      this.curCve = value;
    },
    // 设置所有会话列表
    setCveList(value: ConversationItem[]) {
      this.cves = value;
    },
    // 获取历史信息
    async getMsg(config: any) {
      im.getHistoryMessageList(config).then((res) => {
        if (
          JSON.stringify(this.historyMsgList[this.historyMsgList.length - 1]) ==
          JSON.stringify(JSON.parse(res.data).reverse()[0])
        ) {
          this.historyMsgList.pop();
        }
        this.historyMsgList = [...JSON.parse(res.data).reverse()];
        // this.historyMsgList = JSON.parse(res.data);
      });
    },
    setHistoryMsgList(data: MessageItem) {
      this.historyMsgList = data;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCveStore, import.meta.hot));
}

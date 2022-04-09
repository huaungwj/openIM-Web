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
import type { RcFile } from 'rc-upload/lib/interface';

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
          cveContentRef: null, // 会话内容盒子 ref
          hasMore: true, // 会话列表历史记录是否到底
          isPullMore: false, // 是否正在拉取
          cveCScHeight: 0, // 内容区域可滚动区域高度
          fileInfo: {}, //当前正在上传的文件对象
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
        if (config.startClientMsgID) this.isPullMore = true;

        if (JSON.parse(res.data).length === 0) {
          // 最近一次获取如果数量是0的话则没有了
          this.isPullMore = false;
          this.hasMore = false;
          return;
        }
        if (
          JSON.stringify(this.historyMsgList[this.historyMsgList.length - 1]) ==
          JSON.stringify(JSON.parse(res.data).reverse()[0])
        ) {
          this.historyMsgList.pop();
        }
        this.historyMsgList = [
          ...this.historyMsgList,
          ...JSON.parse(res.data).reverse(),
        ];
        // this.historyMsgList = JSON.parse(res.data);
        this.hasMore = !(JSON.parse(res.data).length < 20);
      });
    },
    setHistoryMsgList(data: MessageItem) {
      this.historyMsgList = data;
    },

    // setCveContentRef
    setCveContentRef(data: any) {
      this.cveContentRef = data;
    },

    // setCveCScHeigth
    setCveCScHeiht(height: number) {
      this.cveCScHeight = height;
    },
    // setisPullMore
    setIsPullMore(status: boolean) {
      this.isPullMore = status;
    },
    //setFileInfo
    setFileInfo(file: RcFile) {
      this.fileInfo = file;
    },

    // // setHasMore
    // setHasMore(status: boolean) {
    //   this.hasMore = status;
    // },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCveStore, import.meta.hot));
}

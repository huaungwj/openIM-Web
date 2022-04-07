import type { ConversationItem, MessageItem } from '@/tools/im/types';
import { useCveStore } from '@/stores/cve';
import { useContactsStore } from '@/stores/contacts';
import { isSingleCve, markCveHasRead } from '@/tools';

const cveStore = useCveStore();
const contactsStore = useContactsStore();

// 获取群聊信息
const getInfo = (cve: ConversationItem) => {
  if (!isSingleCve(cve)) {
    contactsStore.getGroupInfo(cve.groupID);
    const options = {
      groupID: cve.groupID,
      offset: 0,
      filter: 0,
      count: 2000,
    };
    // 获取群成员列表
    contactsStore.getGroupMemberList(options);
  }
};

const getHistoryMsg = (uid?: string, gid?: string, sMsg?: MessageItem) => {
  console.log('getMsg:::');

  const config = {
    userID: uid ?? '',
    groupID: gid ?? '',
    count: 20,
    startClientMsgID: sMsg?.clientMsgID ?? '',
  };
  cveStore.getMsg(config);
};

export function useOpenCveWindow() {
  const openCveWindow = (cve: ConversationItem) => {
    console.log(cve);
    if (cve.conversationID === cveStore.curCve?.conversationID) return;
    // 设置新的会话
    cveStore.setCurCve(cve);
    // 获取群员信息
    getInfo(cve);
    // 获取历史信息
    getHistoryMsg(cve.userID, cve.groupID);
    // 设置已读
    markCveHasRead(cve);
  };

  return { openCveWindow };
}

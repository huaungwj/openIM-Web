import { OpenIMSDK } from './im';
import { tipsTypes } from './im/constants/messageContentType';
import type { ConversationItem, MessageItem } from './im/types';
import { cveSort } from './imT';

export const im = new OpenIMSDK();

export const isSingleCve = (cve: ConversationItem) => {
  return cve.userID !== '' && cve.groupID === '';
};

export const markC2CHasRead = (userID: string, msgIDList: string[]) => {
  im.markC2CMessageAsRead({ userID, msgIDList });
};
export const markCveHasRead = (cve: ConversationItem, type?: number) => {
  if (cve.unreadCount === 0 && !type) return;
  if (isSingleCve(cve)) {
    markC2CHasRead(cve.userID, []);
  } else {
    im.markGroupMessageHasRead(cve.groupID);
  }
};

// 特殊信息列表
const specialMsg = [
  tipsTypes.FRIENDADDED,
  tipsTypes.MEMBERENTER,
  tipsTypes.GROUPINFOUPDATED,
  tipsTypes.REVOKEMESSAGE,
  tipsTypes.GROUPCREATED,
  tipsTypes.MEMBERINVITED,
  tipsTypes.MEMBERKICKED,
  tipsTypes.MEMBERQUIT,
  tipsTypes.GROUPOWNERTRANSFERRED,
];

export { cveSort, contactMenu, specialMsg };

import { OpenIMSDK } from './im';
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

// contact 菜单
const contactMenu = [
  { icon: 'drxx91', text: '常用联系人', num: 10, key: 'tC' },
  { icon: 'a-bianzu61', text: '新的好友', num: 10, key: 'nF' },
  { icon: 'icon_1-09', text: '新的群组', num: 10, key: 'nG' },
  { icon: 'lianxiren', text: '我的好友', num: 10, key: 'mF' },
  { icon: 'a-bianzu38', text: '我的群组', num: 10, key: 'mG' },
];

export { cveSort, contactMenu };

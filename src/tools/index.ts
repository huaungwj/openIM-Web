import { OpenIMSDK } from './im';
import type { ConversationItem, MessageItem } from './im/types';
import { cveSort } from './imT';

export const isSingleCve = (cve: ConversationItem) => {
  return cve.userID !== '' && cve.groupID === '';
};

export const im = new OpenIMSDK();

export { cveSort };

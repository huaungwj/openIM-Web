import type { ConversationItem, MessageItem } from './im/types';
import {
  messageTypes,
  tipsTypes,
  SessionType,
} from '@/tools/im/constants/messageContentType';

export const cveSort = (cveList: ConversationItem[]) => {
  const arr: string[] = [];
  const filterArr = cveList.filter(
    (c) => !arr.includes(c.conversationID) && arr.push(c.conversationID)
  );
  filterArr.sort((a, b) => {
    if (a.isPinned === b.isPinned) {
      const aCompare =
        a.draftTextTime! > a.latestMsgSendTime!
          ? a.draftTextTime!
          : a.latestMsgSendTime!;
      const bCompare =
        b.draftTextTime! > b.latestMsgSendTime!
          ? b.draftTextTime!
          : b.latestMsgSendTime!;
      if (aCompare > bCompare) {
        return -1;
      } else if (aCompare < bCompare) {
        return 1;
      } else {
        return 0;
      }
    } else if (a.isPinned && !b.isPinned) {
      return -1;
    } else {
      return 1;
    }
  });
  return filterArr;
};

// 消息类型
export const parseMessageType = (
  pmsg: MessageItem,
  curUid?: string
): string => {
  const isSelf = (id: string) => id === curUid;

  switch (pmsg.contentType) {
    case messageTypes.TEXTMESSAGE:
      return pmsg.senderNickname + ':  ' + pmsg.content;
    case messageTypes.ATTEXTMESSAGE:
      return pmsg.senderNickname + ':  ' + pmsg.atElem.text;
    case messageTypes.PICTUREMESSAGE:
      return '[图片信息]';
    case messageTypes.VIDEOMESSAGE:
      return '[视频信息]';
    case messageTypes.VOICEMESSAGE:
      return '[语音信息]';
    case messageTypes.LOCATIONMESSAGE:
      return '[地理信息]';
    case messageTypes.CARDMESSAGE:
      return '[名片信息]';
    case messageTypes.MERGERMESSAGE:
      return '[合并信息]';
    case messageTypes.FILEMESSAGE:
      return '[文件信息]';
    case messageTypes.REVOKEMESSAGE:
      return `${
        isSelf(pmsg.sendID) ? '你' : pmsg.senderNickname
      }${'撤回了一条消息'}`;
    case messageTypes.CUSTOMMESSAGE:
      return '[自定义消息]';
    case messageTypes.QUOTEMESSAGE:
      return '[引用消息]';
    case tipsTypes.FRIENDADDED:
      return '你们已经是好友啦，开始聊天吧~';
    case tipsTypes.MEMBERENTER:
      const enterDetails = JSON.parse(pmsg.notificationElem.detail);
      const enterUser = enterDetails.entrantUser;
      return `${
        isSelf(enterUser.userID) ? '你' : enterUser.nickname
      }${'加入了群聊'}`;
    case tipsTypes.GROUPCREATED:
      const groupCreatedDetail = JSON.parse(pmsg.notificationElem.detail);
      const groupCreatedUser = groupCreatedDetail.opUser;
      return `${
        isSelf(groupCreatedUser.userID) ? '你' : groupCreatedUser.nickname
      }创建了群聊`;
    case tipsTypes.MEMBERINVITED:
      const inviteDetails = JSON.parse(pmsg.notificationElem.detail);
      const inviteOpUser = inviteDetails.opUser;
      const invitedUserList = inviteDetails.invitedUserList ?? [];
      let inviteStr = '';
      invitedUserList.forEach(
        (user: any) =>
          (inviteStr += (isSelf(user.userID) ? '你' : user.nickname) + ' ')
      );
      return `${
        isSelf(inviteOpUser.userID) ? '你' : inviteOpUser.nickname
      }'邀请了'${inviteStr}入群`;
    case tipsTypes.MEMBERKICKED:
      const kickDetails = JSON.parse(pmsg.notificationElem.detail);
      const kickOpUser = kickDetails.opUser;
      const kickdUserList = kickDetails.kickedUserList ?? [];
      let kickStr = '';
      kickdUserList.forEach(
        (user: any) =>
          (kickStr += (isSelf(user.userID) ? '你' : user.nickname) + ' ')
      );
      return `${
        isSelf(kickOpUser.userID) ? '你' : kickOpUser.nickname
      }踢出了${kickStr}`;
    case tipsTypes.MEMBERQUIT:
      const quitDetails = JSON.parse(pmsg.notificationElem.detail);
      const quitUser = quitDetails.quitUser;
      return `${isSelf(quitUser.userID) ? '你' : quitUser.nickname}
        '退出了群聊'
      `;
    case tipsTypes.GROUPINFOUPDATED:
      const groupUpdateDetail = JSON.parse(pmsg.notificationElem.detail);
      const groupUpdateUser = groupUpdateDetail.opUser;
      return `${
        isSelf(groupUpdateUser.userID) ? '你' : groupUpdateUser.nickname
      }修改了群信息`;
    default:
      return pmsg.notificationElem.defaultTips;
  }
};

export const createNotification = (
  message: MessageItem,
  click?: (id: string, type: SessionType) => void,
  tag?: string
) => {
  if (Notification && document.hidden) {
    const title =
      message.contentType === tipsTypes.FRIENDADDED
        ? '新朋友'
        : message.senderNickname;
    const notification = new Notification(title, {
      dir: 'auto',
      tag: tag ?? (message.groupID === '' ? message.sendID : message.groupID),
      renotify: true,
      icon: message.senderFaceUrl,
      body: parseMessageType(message),
      requireInteraction: true,
    });
    const id =
      message.sessionType === SessionType.SINGLECVE
        ? message.contentType === tipsTypes.FRIENDADDED
          ? message.recvID
          : message.sendID
        : message.groupID;
    notification.onclick = () => {
      click && click(id, message.sessionType);
      notification.close();
    };
  }
};

import type { ConversationItem, MessageItem } from './im/types';
import { i18n } from '@/locales/index';
import {
  messageTypes,
  tipsTypes,
  SessionType,
} from '@/tools/im/constants/messageContentType';

const t = i18n.global.t;

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
      return `[${t('pic') + t('message')}]`;
    case messageTypes.VIDEOMESSAGE:
      return `[${t('video') + t('message')}]`;
    case messageTypes.VOICEMESSAGE:
      return `[${t('voice') + t('message')}]`;
    case messageTypes.LOCATIONMESSAGE:
      return `[${t('location') + t('message')}]`;
    case messageTypes.CARDMESSAGE:
      return `[${t('businessCard') + t('message')}]`;
    case messageTypes.MERGERMESSAGE:
      return `[${t('merge') + t('message')}]`;
    case messageTypes.FILEMESSAGE:
      return `[${t('file') + t('message')}]`;
    case messageTypes.REVOKEMESSAGE:
      return `${isSelf(pmsg.sendID) ? t('your') : pmsg.senderNickname}${t(
        'cve.revorkOnlyMsg'
      )}`;
    case messageTypes.CUSTOMMESSAGE:
      return `[${t('custom') + t('message')}]`;
    case messageTypes.QUOTEMESSAGE:
      return `[${t('quote') + t('message')}]`;
    case tipsTypes.FRIENDADDED:
      return t('cve.aCall');
    case tipsTypes.MEMBERENTER: {
      const enterDetails = JSON.parse(pmsg.notificationElem.detail);
      const enterUser = enterDetails.entrantUser;
      return `${isSelf(enterUser.userID) ? t('your') : enterUser.nickname}${t(
        'cve.joinedGroup'
      )}`;
    }
    case tipsTypes.GROUPCREATED: {
      const groupCreatedDetail = JSON.parse(pmsg.notificationElem.detail);
      const groupCreatedUser = groupCreatedDetail.opUser;
      return `${
        isSelf(groupCreatedUser.userID) ? t('your') : groupCreatedUser.nickname
      }${t('cve.createdGroup')}`;
    }
    case tipsTypes.MEMBERINVITED: {
      const inviteDetails = JSON.parse(pmsg.notificationElem.detail);
      const inviteOpUser = inviteDetails.opUser;
      const invitedUserList = inviteDetails.invitedUserList ?? [];
      let inviteStr = '';
      invitedUserList.forEach(
        (user: any) =>
          (inviteStr += (isSelf(user.userID) ? t('your') : user.nickname) + ' ')
      );
      return `${
        isSelf(inviteOpUser.userID) ? t('your') : inviteOpUser.nickname
      }${t('cve.invitedText') + inviteStr + t('cve.groupEntry')}`;
    }
    case tipsTypes.MEMBERKICKED: {
      const kickDetails = JSON.parse(pmsg.notificationElem.detail);
      const kickOpUser = kickDetails.opUser;
      const kickdUserList = kickDetails.kickedUserList ?? [];
      let kickStr = '';
      kickdUserList.forEach(
        (user: any) =>
          (kickStr += (isSelf(user.userID) ? t('your') : user.nickname) + ' ')
      );
      return `${isSelf(kickOpUser.userID) ? t('your') : kickOpUser.nickname}${
        t('cve.kickGroupSucText') + kickStr
      }`;
    }

    case tipsTypes.MEMBERQUIT: {
      const quitDetails = JSON.parse(pmsg.notificationElem.detail);
      const quitUser = quitDetails.quitUser;
      return (
        `${isSelf(quitUser.userID) ? t('your') : quitUser.nickname}
      
      ` + t('cve.exitGroupText')
      );
    }

    case tipsTypes.GROUPINFOUPDATED: {
      const groupUpdateDetail = JSON.parse(pmsg.notificationElem.detail);
      const groupUpdateUser = groupUpdateDetail.opUser;
      return `${
        isSelf(groupUpdateUser.userID)
          ? t('your')
          : groupUpdateUser.nickname + t('cve.editGroupInfo')
      }`;
    }

    case tipsTypes.GROUPOWNERTRANSFERRED: {
      const transferDetails = JSON.parse(pmsg.notificationElem.detail);
      const transferOpUser = transferDetails.opUser;
      const newOwner = transferDetails.newGroupOwner;

      return `${
        isSelf(transferOpUser.userID) ? t('your') : transferOpUser.nickname
      }  ${
        t('cve.transferGroupText') + isSelf(newOwner.userID)
          ? t('your')
          : newOwner.nickname
      }`;
    }

    default:
      return pmsg.notificationElem.defaultTips;
  }
};

export const createNotification = (
  message: MessageItem,
  click?: (id: string, type: SessionType) => void,
  tag?: string
) => {
  // const { t } = useI18n();
  console.log(Notification, document.hidden);
  if (Notification && document.hidden) {
    console.log('执行了');
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
    console.log(notification);
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

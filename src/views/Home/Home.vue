<template>
  <n-layout
    has-sider
    position="absolute"
    style="height: 100vh; background: 'none'"
  >
    <n-layout-sider
      style="backgournd: 'none'"
      :width="60"
      ref="siderRef"
      bordered
    >
      <left-sider />
    </n-layout-sider>
    <n-layout-content :native-scrollbar="false">
      <router-view />
    </n-layout-content>

    <n-layout-content
      ref="cveContentRef"
      :native-scrollbar="false"
      :on-scroll="scrollChange"
    >
      <router-view name="right" :native-scrollbar="false" />
    </n-layout-content>

    <CreateGARelayM />
  </n-layout>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted, nextTick } from 'vue';
import type { LayoutInst, LayoutSiderInst } from 'naive-ui';
import LeftSider from '@/components/LeftSider/LeftSider.vue';
import CreateGARelayM from '@/components/CreateGARelayM/CreateGARelayM.vue';
import { im, cveSort } from '@/tools';
import { throttle } from '@/tools/tools';
import { useImLogin } from '@/hooks/useImLogin';
import { useCveStore } from '@/stores/cve';
import { useContactsStore } from '@/stores/contacts';
import { useUserStore } from '@/stores/user';
import { CbEvents } from '@/tools/im';
import { useMessage } from 'naive-ui';
import type {
  ConversationItem,
  WsResponse,
  FriendApplicationItem,
  GroupApplicationItem,
  MarkC2CParams,
  MessageItem,
} from '@/tools/im/types';
import { useRoute } from 'vue-router';
import router from '../../router';

type GruopHandlerType =
  | 'added'
  | 'deleted'
  | 'info'
  | 'memberAdded'
  | 'memberDeleted';

const token = localStorage.getItem(`improfile`);
const userID = localStorage.getItem('lastimuid');
const { imLogin } = useImLogin();
const siderRef = ref<LayoutSiderInst | null>(null);
const cveContentRef = ref<LayoutInst | null>(null);
const message = useMessage();
const cveStore = useCveStore();
const contactsStore = useContactsStore();
const userStore = useUserStore();
const route = useRoute();
const networkOnLine = ref<boolean>(navigator.onLine);
// 是否登录
const isLogin = () => {
  if (token && userID) {
    im.getLoginStatus()
      .then(() => {
        message.success('登录成功');
      })
      .catch(() => {
        if (token && userID) {
          imLogin(userID, token);
        }
      });
  }
};
isLogin();

// 滚动
const scrollChange = throttle(
  () => {
    if (cveStore.cveCScHeight !== cveStore.cveContentRef.scrollHeight) {
      cveStore.setCveCScHeiht(cveStore.cveContentRef.scrollHeight);
    }
    // 获取更多历史信息
    if (
      cveStore.cveContentRef.scrollTop < 100 &&
      cveStore.hasMore &&
      route.path === '/cve' &&
      cveStore.historyMsgList.length > 0
    ) {
      // 到顶
      const config = {
        userID: cveStore.curCve.userID ?? '',
        groupID: cveStore.curCve.groupID ?? '',
        count: 20,
        startClientMsgID:
          cveStore.historyMsgList[cveStore.historyMsgList.length - 1]
            .clientMsgID,
      };
      cveStore.getMsg(config);
    }
  },
  300,
  2
);

// 未读消息发生变化触发
im.on(CbEvents.ONTOTALUNREADMESSAGECOUNTCHANGED, (data) => {
  // dispatch(setUnReadCount(Number(data.data)));
  contactsStore.setUnReadCount(data.data);
});

// 有新的信息的时候触发
const conversationChnageHandler = (data: WsResponse) => {
  // console.log("ONCONVERSATIONCHANGED 发生改变了", data);
  let tmpCves = cveStore.cves;
  let filterArr: ConversationItem[] = [];
  const changes: ConversationItem[] = JSON.parse(data.data);
  // 最近一条消息
  const ms = JSON.parse(changes[0].latestMsg);
  const chids = changes.map((ch) => ch.conversationID);
  filterArr = tmpCves.filter(
    (tc: ConversationItem) => !chids.includes(tc.conversationID)
  );
  // 查找当前会话的信息 进行替换
  const idx = changes.findIndex(
    (c) => c.conversationID === cveStore.curCve?.conversationID
  );
  if (idx !== -1) cveStore.setCurCve(changes[idx]);
  const result = [...changes, ...filterArr];
  cveStore.setCveList(cveSort(result));
};

// 新的会话处理
const newConversationHandler = (data: WsResponse) => {
  // console.log("ONCONVERSATIONCHANGED 新会话触发");
  let tmpCves = cveStore.cves;
  const news: ConversationItem[] = JSON.parse(data.data);
  const result = [...news, ...tmpCves];
  cveStore.setCveList(cveSort(result));
};

// 标记为已读
const c2cMsgHandler = (data: WsResponse) => {
  let tmpArr: MessageItem[] = [];
  JSON.parse(data.data).map((msg: MarkC2CParams) => {
    msg.msgIDList.forEach((crt: string) => {
      tmpArr = cveStore.historyMsgList.map((hism: MessageItem) => {
        if (hism.clientMsgID === crt) {
          hism.isRead = true;
        }
        return hism;
      });
    });
  });
  cveStore.setHistoryMsgList(tmpArr);
};

/**
 * 会话相关
 */
im.on(CbEvents.ONCONVERSATIONCHANGED, conversationChnageHandler);
im.on(CbEvents.ONNEWCONVERSATION, newConversationHandler);
im.on(CbEvents.ONRECVC2CREADRECEIPT, c2cMsgHandler);

const friendHandlerTemplate = (
  data: WsResponse,
  type: 'info' | 'added' | 'deleted'
) => {
  console.log('ONFRIENDINFOCHANGED  朋友信息更改的时候触发');
  const user = JSON.parse(data.data);
  const tmpArr = [...contactsStore.friendList];
  if (type === 'info') {
    const idx = tmpArr.findIndex((f) => f.userID === user.userID);
    if (idx !== -1) tmpArr[idx] = user;
  } else if (type === 'added') {
    tmpArr.push(user);
  } else {
    const idx = tmpArr.findIndex((f) => f.userID === user.userID);
    if (idx !== -1) tmpArr.splice(idx, 1);
  }
  contactsStore.setFriendList(tmpArr);
};

const friednInfoChangeHandler = (data: WsResponse) =>
  friendHandlerTemplate(data, 'info');
const friednAddedHandler = (data: WsResponse) =>
  friendHandlerTemplate(data, 'added');
const friednDeletedHandler = (data: WsResponse) =>
  friendHandlerTemplate(data, 'deleted');

/**
 * 朋友列表相关
 */
im.on(CbEvents.ONFRIENDINFOCHANGED, friednInfoChangeHandler);
im.on(CbEvents.ONFRIENDADDED, friednAddedHandler);
im.on(CbEvents.ONFRIENDDELETED, friednDeletedHandler);

// 黑名单新增
const blackAddedHandler = (data: WsResponse) => {
  const black = JSON.parse(data.data);
  const tmpBlackArr = [...contactsStore.blackList];
  const tmpFriendArr = [...contactsStore.friendList];
  const idx = tmpFriendArr.findIndex((f) => f.userID === black.userID);
  if (idx !== -1) tmpFriendArr.splice(idx, 1);
  tmpBlackArr.push(black);
  contactsStore.setBlackList(tmpBlackArr);
  contactsStore.setFriendList(tmpFriendArr);
};
// 黑名单减少
const blackDeletedHandler = async (data: WsResponse) => {
  const black = JSON.parse(data.data);
  const tmpBlackArr = [...contactsStore.blackList];
  const tmpFriendArr = [...contactsStore.friendList];
  let { data: result } = await im.getDesignatedFriendsInfo([black.userID]);
  result = JSON.parse(result);
  if (result.length > 0 && result[0].friendInfo) {
    tmpFriendArr.push(result[0].friendInfo);
  }
  const delIdx = tmpBlackArr.findIndex((b) => b.userID === black.userID);
  if (delIdx !== -1) tmpBlackArr.splice(delIdx, 1);
  contactsStore.setBlackList(tmpBlackArr);
  contactsStore.setFriendList(tmpFriendArr);
};
/**
 * 黑名单监听
 */
im.on(CbEvents.ONBLACKADDED, blackAddedHandler);
im.on(CbEvents.ONBLACKDELETED, blackDeletedHandler);

const isCurGroup = (gid: string) => cveStore.curCve?.groupID === gid;

const groupHandlerTemplate = (data: WsResponse, type: GruopHandlerType) => {
  console.log('群组信息触发了', data);
  const result = JSON.parse(data.data);
  const tmpArr = [...contactsStore.groupList];
  const idx = tmpArr.findIndex((f) => f.groupID === result.groupID);
  switch (type) {
    case 'info':
      if (idx !== -1) tmpArr[idx] = result;
      console.log(result);
      if (isCurGroup(result.groupID)) contactsStore.setGroupInfo(result);
      break;
    case 'added':
      tmpArr.push(result);
      if (isCurGroup(result.groupID)) {
        contactsStore.setGroupInfo(result);
        const options = {
          groupID: result.groupID,
          offset: 0,
          filter: 0,
          count: 2000,
        };
        contactsStore.getGroupMemberList(options);
      }
      break;
    case 'deleted':
      if (isCurGroup(result.groupID)) {
        tmpArr[idx].memberCount -= 1;
        contactsStore.setGroupInfo(tmpArr[idx]);
      }
      if (idx !== -1) tmpArr.splice(idx, 1);
      break;
    case 'memberAdded':
      if (idx !== -1) {
        tmpArr[idx].memberCount += 1;
        if (isCurGroup(result.groupID)) {
          const tempArr2 = [...contactsStore.groupMemberList];
          tempArr2.push(result);
          contactsStore.setGroupInfo(tmpArr[idx]);
          contactsStore.etGroupMemberList(tempArr2);
        }
      }
      break;
    case 'memberDeleted':
      if (idx !== -1) {
        tmpArr[idx].memberCount -= 1;
        if (isCurGroup(result.groupID)) {
          const tempArr2 = [...contactsStore.groupMemberList];
          const delIdx = tempArr2.findIndex((m) => m.userID === result.userID);
          if (delIdx !== -1) tempArr2.splice(delIdx, 1);
          contactsStore.setGroupInfo(tmpArr[idx]);
          contactsStore.setGroupMemberList(tempArr2);
        }
      }
      break;
  }

  contactsStore.setGroupList(tmpArr);
};

const joinedGroupAddedHandler = (data: WsResponse) =>
  groupHandlerTemplate(data, 'added');

const joinedGroupDeletedHandler = (data: WsResponse) =>
  groupHandlerTemplate(data, 'deleted');

const groupInfoChangedHandler = (data: WsResponse) =>
  groupHandlerTemplate(data, 'info');

const groupMemberAddedHandler = (data: WsResponse) =>
  groupHandlerTemplate(data, 'memberAdded');

const groupMemberDeletedHandler = (data: WsResponse) =>
  groupHandlerTemplate(data, 'memberDeleted');
/**
 * 群聊
 */
im.on(CbEvents.ONJOINEDGROUPADDED, joinedGroupAddedHandler);
im.on(CbEvents.ONJOINEDGROUPDELETED, joinedGroupDeletedHandler);
im.on(CbEvents.ONGROUPINFOCHANGED, groupInfoChangedHandler);
im.on(CbEvents.ONGROUPMEMBERADDED, groupMemberAddedHandler);
im.on(CbEvents.ONGROUPMEMBERDELETED, groupMemberDeletedHandler);

const applicationHandlerTemplate = (
  data: any,
  failed: string,
  reqFlag = false
) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let dispatchFn = (list: any) => {};
  let tmpArr: any[] = [];
  switch (failed) {
    case 'toUserID':
      dispatchFn = contactsStore.setSentFriendApplicationList;
      tmpArr = [...contactsStore.sentFriendApplicationList];
      break;
    case 'fromUserID':
      dispatchFn = contactsStore.setRecvFriendApplicationList;
      tmpArr = [...contactsStore.recvFriendApplicationList];
      break;
    case 'groupID':
      dispatchFn = contactsStore.setSentGroupApplicationList;
      tmpArr = [...contactsStore.sentGroupApplicationList];
      break;
    // eslint-disable-next-line no-duplicate-case
    case 'fromUserID':
      dispatchFn = contactsStore.setRecvGroupApplicationList;
      tmpArr = [...contactsStore.recvGroupApplicationList];
      break;
  }
  const application = JSON.parse(data.data);
  const idx = tmpArr.findIndex(
    (a) =>
      a[failed] === application[failed] &&
      (reqFlag || a.reqMsg !== application.reqMsg)
  );
  if (idx !== -1) tmpArr.splice(idx, 1);
  tmpArr.unshift(application);
  dispatchFn(tmpArr);
};

const isReceivedFriendApplication = (fromUserID: string) =>
  fromUserID !== userStore.selfInfo.userID;
const isReceivedGroupApplication = (userID: string) =>
  userID !== userStore.selfInfo.userID;

const friendApplicationAddedHandler = (data: WsResponse) => {
  const application: FriendApplicationItem = JSON.parse(data.data);
  isReceivedFriendApplication(application.fromUserID)
    ? applicationHandlerTemplate(data, 'fromUserID')
    : applicationHandlerTemplate(data, 'toUserID');
};
const friendApplicationProcessedHandler = (data: WsResponse) => {
  const application: FriendApplicationItem = JSON.parse(data.data);
  isReceivedFriendApplication(application.fromUserID)
    ? applicationHandlerTemplate(data, 'fromUserID', true)
    : applicationHandlerTemplate(data, 'toUserID', true);
};
/**
 * 好友申请
 */
im.on(CbEvents.ONFRIENDAPPLICATIONADDED, friendApplicationAddedHandler);
im.on(CbEvents.ONFRIENDAPPLICATIONACCEPTED, friendApplicationProcessedHandler);
im.on(CbEvents.ONFRIENDAPPLICATIONREJECTED, friendApplicationProcessedHandler);
// im.on(CbEvents.ONFRIENDAPPLICATIONDELETED, () => {
//   contactsStore.getRecvFriendApplicationList()
// });

const groupApplicationAddedHandler = (data: WsResponse) => {
  const application: GroupApplicationItem = JSON.parse(data.data);
  isReceivedGroupApplication(application.userID)
    ? applicationHandlerTemplate(data, 'userID')
    : applicationHandlerTemplate(data, 'groupID');
};
const groupApplicationProcessedHandler = (data: WsResponse) => {
  const application: GroupApplicationItem = JSON.parse(data.data);
  isReceivedGroupApplication(application.userID)
    ? applicationHandlerTemplate(data, 'userID', true)
    : applicationHandlerTemplate(data, 'groupID', true);
};

/**
 * 群聊申请
 */
im.on(CbEvents.ONGROUPAPPLICATIONADDED, groupApplicationAddedHandler);
im.on(CbEvents.ONGROUPAPPLICATIONACCEPTED, groupApplicationProcessedHandler);
im.on(CbEvents.ONGROUPAPPLICATIONREJECTED, groupApplicationProcessedHandler);

const kickOffline = (data: WsResponse) => {
  console.log(data);
  router.replace('/login');
};

const tokenExpired = (data: WsResponse) => {
  console.log(data);
  router.replace('/login');
};

/**
 * 被踢下线
 */
im.on(CbEvents.ONKICKEDOFFLINE, kickOffline);
/**
 * 账号token过期
 */
im.on(CbEvents.ONUSERTOKENEXPIRED, tokenExpired);

onMounted(() => {
  nextTick(() => {
    cveStore.setCveContentRef(
      cveContentRef.value?.$el!.children[0].childNodes[0]
    );
  });
});

// 组件销毁
onBeforeUnmount(() => {
  console.log('销毁了， conversationChnageHandler');
  /**
   * 会话
   */
  im.off(CbEvents.ONCONVERSATIONCHANGED, conversationChnageHandler);
  im.off(CbEvents.ONNEWCONVERSATION, newConversationHandler);
  /**
   * 好友信息
   */
  im.off(CbEvents.ONFRIENDINFOCHANGED, friednInfoChangeHandler);
  im.off(CbEvents.ONFRIENDADDED, friednAddedHandler);
  im.off(CbEvents.ONFRIENDDELETED, friednDeletedHandler);
  /**
   * 黑名单
   */
  im.off(CbEvents.ONBLACKADDED, blackAddedHandler);
  im.off(CbEvents.ONBLACKDELETED, blackDeletedHandler);
  /**
   * 群聊
   */
  im.off(CbEvents.ONJOINEDGROUPADDED, joinedGroupAddedHandler);
  im.off(CbEvents.ONJOINEDGROUPDELETED, joinedGroupDeletedHandler);
  im.off(CbEvents.ONGROUPINFOCHANGED, groupInfoChangedHandler);
  im.off(CbEvents.ONGROUPMEMBERADDED, groupMemberAddedHandler);
  im.off(CbEvents.ONGROUPMEMBERDELETED, groupMemberDeletedHandler);
  /**
   * 好友申请
   */
  im.off(CbEvents.ONFRIENDAPPLICATIONADDED, friendApplicationAddedHandler);
  im.off(
    CbEvents.ONFRIENDAPPLICATIONACCEPTED,
    friendApplicationProcessedHandler
  );
  im.off(
    CbEvents.ONFRIENDAPPLICATIONREJECTED,
    friendApplicationProcessedHandler
  );
  /**
   * 群聊申请
   */
  im.off(CbEvents.ONGROUPAPPLICATIONADDED, groupApplicationAddedHandler);
  // im.on(CbEvents.ONRECEIVEJOINGROUPAPPLICATIONADDED, recvGroupApplicationAddedHandler);
  im.off(CbEvents.ONGROUPAPPLICATIONACCEPTED, groupApplicationProcessedHandler);
  im.off(CbEvents.ONGROUPAPPLICATIONREJECTED, groupApplicationProcessedHandler);
});

/**
 * 被踢下线
 */
im.off(CbEvents.ONKICKEDOFFLINE, kickOffline);
/**
 * 账号token过期
 */
im.off(CbEvents.ONUSERTOKENEXPIRED, tokenExpired);

window.urlClick = (url: string) => {
  if (url.indexOf('http') === -1 && url.indexOf('https') === -1) {
    url = `http://${url}`;
  }
  window.open(url, '_blank');
};

const updateOnlineStatus = () => {
  networkOnLine.value = navigator.onLine;
  if (networkOnLine.value) {
    message.success('网络重连成功！');
    isLogin();
  } else {
    message.error('掉线啦（>_<）...');
  }
};
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
</script>

<style></style>

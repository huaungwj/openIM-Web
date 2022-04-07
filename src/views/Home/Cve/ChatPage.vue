<template>
  <!-- 当前聊天会话框 -->
  <div class="chat_page_container">
    <div v-if="cveStore.curCve">
      <!-- 头部用户信息栏 -->
      <ChatTopBar />
      <!-- 会话主体内容 -->
      <CharContent />
      <!-- 底部信息框 -->
      <CharFooterBar />
    </div>

    <Empty v-else :imgSrc="`/src/assets/images/empty1.png`">
      <template #header>
        <p class="title" style="font-size: 20px">快去聊天吧~</p>
        <p class="sub_title" style="padding-top: 10px">
          选择一个聊天窗口进行聊天吧~
        </p>
      </template>
    </Empty>
  </div>
</template>

<script lang="ts" setup>
import { watch, onBeforeUnmount } from 'vue';
import ChatTopBar from '@/views/Home/Cve/ChatPage/ChatTopBar.vue';
import CharContent from './ChatPage/CharContent.vue';
import CharFooterBar from '@/views/Home/Cve/ChatPage/ChatFooterBar.vue';
import { CbEvents } from '@/tools/im';
import type {
  ConversationItem,
  MessageItem,
  WsResponse,
} from '@/tools/im/types';
import { SessionType } from '@/tools/im/constants/messageContentType';
import { messageTypes } from '@/tools/im/constants/messageContentType';
import { useCveStore } from '@/stores/cve';
import { useUserStore } from '@/stores/user';
import { isSingleCve, im, markCveHasRead } from '@/tools';
import { useMessage } from 'naive-ui';
import { createNotification } from '@/tools/imT';
import Empty from '@/components/Empty/Empty.vue';
import { useOpenCveWindow } from '@/hooks/useOpenCveWindow';

const cveStore = useCveStore();
const userStore = useUserStore();
const message = useMessage();
const { openCveWindow } = useOpenCveWindow();

// 单聊还是群聊
const inCurCve = (newServerMsg: MessageItem): boolean => {
  // 发送者
  const isCurSingle =
    newServerMsg.sendID === cveStore.curCve?.userID ||
    (newServerMsg.sendID === userStore.selfInfo.userID &&
      newServerMsg.recvID === cveStore.curCve?.userID);
  return newServerMsg.sessionType === SessionType.SINGLECVE
    ? isCurSingle
    : newServerMsg.groupID === cveStore.curCve?.groupID;
};

// 新消息回调
const newMsgHandler = (data: WsResponse) => {
  console.log('12323333 new message');
  const newServerMsg: MessageItem = JSON.parse(data.data);
  // 消息类型不是正在输入的类型 && 不是自己的消息 创建消息通知
  if (
    newServerMsg.contentType !== messageTypes.TYPINGMESSAGE &&
    newServerMsg.sendID !== userStore.selfInfo.userID
  ) {
    createNotification(newServerMsg, (id, sessionType) => {
      assignHandler(id, sessionType);
      // window.electron ? window.electron.focusHomePage() : window.focus();
    });
  }
  // 当前有正在聊天的会话
  if (cveStore.curCve) {
    if (inCurCve(newServerMsg)) {
      // 单聊
      if (newServerMsg.contentType === messageTypes.TYPINGMESSAGE) {
        // 输入中
        // typingUpdate();
      } else {
        if (newServerMsg.contentType === messageTypes.REVOKEMESSAGE) {
          cveStore.setHistoryMsgList([
            newServerMsg,
            ...cveStore.historyMsgList.filter((ms) => {
              console.log(ms.clientMsgID, newServerMsg.content);

              return ms.clientMsgID !== newServerMsg.content;
            }),
          ]);
        } else {
          cveStore.setHistoryMsgList([
            newServerMsg,
            ...cveStore.historyMsgList,
          ]);
        }
        markCveHasRead(cveStore.curCve, 1);
      }
    }
  }
};

const assignHandler = (id: string, type: SessionType) => {
  getOneCve(id, type)
    .then((cve: ConversationItem) => openCveWindow(cve))
    .catch((err: any) => message.error('找不到会话！'));
};

const getOneCve = (
  sourceID: string,
  sessionType: number
): Promise<ConversationItem> => {
  return new Promise((resolve, reject) => {
    im.getOneConversation({ sourceID, sessionType })
      .then((res) => resolve(JSON.parse(res.data)))
      .catch((err) => reject(err));
  });
};

im.on(CbEvents.ONRECVNEWMESSAGE, newMsgHandler);

onBeforeUnmount(() => {
  im.off(CbEvents.ONRECVNEWMESSAGE, newMsgHandler);
});
</script>

<style>
.chat_page_container {
  width: 1200px;
  height: 100vh;
  background-color: var(--im-theme-chatPageBg);
}
</style>

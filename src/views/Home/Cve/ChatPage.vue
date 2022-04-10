<template>
  <!-- 当前聊天会话框 -->
  <div class="chat_page_container">
    <div
      @dragenter="dragenterFun"
      @dragleave="dragleaveFun"
      @dragover="dragoverFun"
      @drop="dropFun"
      v-if="cveStore.curCve"
      :class="` ${isDragetIng && 'dragent_active'}`"
    >
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
import { watch, onBeforeUnmount, ref, onMounted } from 'vue';
import ChatTopBar from '@/views/Home/Cve/ChatPage/ChatTopBar.vue';
import CharContent from './ChatPage/CharContent.vue';
import CharFooterBar from '@/views/Home/Cve/ChatPage/ChatFooterBar.vue';
import { CbEvents, uuid } from '@/tools/im';
import type {
  ConversationItem,
  MessageItem,
  WsResponse,
} from '@/tools/im/types';
import { SessionType } from '@/tools/im/constants/messageContentType';
import { messageTypes } from '@/tools/im/constants/messageContentType';
import { useCveStore } from '@/stores/cve';
import { useUserStore } from '@/stores/user';
import { im, markCveHasRead } from '@/tools';
import { useMessage } from 'naive-ui';
import { createNotification } from '@/tools/imT';
import Empty from '@/components/Empty/Empty.vue';
import { useOpenCveWindow } from '@/hooks/useOpenCveWindow';
import type { RcFile } from 'rc-upload/lib/interface';
import { useUploadFile } from '@/hooks/useUploadFile';

const cveStore = useCveStore();
const userStore = useUserStore();
const message = useMessage();
const { sendCosMsg } = useUploadFile();
const { openCveWindow } = useOpenCveWindow();
const isDragetIng = ref<boolean>(false); // 是否正在拖拽
const lastenter = ref(null);
const scaleName = ref<string>(''); // 文件读取阶段状态
const scale = ref<number>(0); // 本地上传进度

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

// 拖拽进入指定区域
const dragenterFun = function (e) {
  if (scaleName.value) scaleName.value = '';
  console.log('在容器里面拖动');
  lastenter.value = e.target;
  console.log(e.target);
  if (!isDragetIng.value) isDragetIng.value = true;
};
// 拖拽离开指定区域
const dragleaveFun = function (e) {
  if (isDragetIng.value && lastenter.value == e.target) {
    console.log('在容器离开了', e.target);
    isDragetIng.value = false;
  }
};

// 在指定的区域拖拽 此处不能用节流，否则不能执行
const dragoverFun = function (e) {
  console.log('拖拽了');
  e.preventDefault();
};

// 拖拽的时候鼠标松开
const dropFun = function (e: DragEvent) {
  // 这里阻止默认事件 为阻止浏览器自动打开拖拽文件
  e.preventDefault();
  cveStore.setFileInfo({});
  console.log('鼠标松开了', e.dataTransfer?.files);

  if (e.dataTransfer?.files.length === 0 || e.dataTransfer?.files.length > 1) {
    isDragetIng.value = false;
    return message.warning('暂时不支持多文件发送');
  }

  // 文件内容
  let oFile: RcFile = e.dataTransfer.files[0];
  oFile.uid = oFile.id = uuid('openIM');
  cveStore.setFileInfo(oFile);
  const fileList = ['image', 'video'];
  // 获取type
  let type = oFile.type.split('/')[0];
  // 上传到cos
  sendCosMsg(oFile, fileList.some((item) => item === type) ? type : 'file');
  // 关闭蒙层
  if (isDragetIng.value) isDragetIng.value = false;
};

im.on(CbEvents.ONRECVNEWMESSAGE, newMsgHandler);

onBeforeUnmount(() => {
  im.off(CbEvents.ONRECVNEWMESSAGE, newMsgHandler);
});
</script>

<style>
.chat_page_container {
  width: 1190px;
  height: 100vh;
  background-color: var(--im-theme-chatPageBg);
}

.dragent_active:before {
  background: var(--color-border);
  background-size: 30px 30px;
  border-left: 1px dashed var(--im-theme-primary);
  z-index: 300;
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20%;
  height: 100%;
  transition: all 1s;
}
.dragent_active > * {
  pointer-events: none;
}
</style>

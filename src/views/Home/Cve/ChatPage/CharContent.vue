<template>
  <main class="chat_bg" ref="msgListRef">
    <!-- 信息列表 -->

    <MsgItem
      v-for="msg in cveStore.historyMsgList"
      :key="msg.clientMsgID"
      :msg="msg"
      @contextmenu.prevent="openMsgMenu($event, msg)"
    />

    <!-- 没有更多了 -->
    <div class="index_con_nomore__Hfico" v-if="!cveStore.hasMore">
      没有更多啦
    </div>

    <ContextMenu class="msg_menu" :offset="menuOffset">
      <template v-slot:menuItem>
        <li v-for="item in msgMenus" :key="item.icon" @click="item.method">
          <div v-if="!item.hidden">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="`#${item.icon}`"></use>
            </svg>
            {{ item.title }}
          </div>
        </li>
      </template>
    </ContextMenu>
  </main>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Ref } from 'vue';
import MsgItem from '@/views/Home/Cve/ChatPage/components/MsgItem.vue';
import ContextMenu from '@/components/ContextMenu/ContextMenu.vue';
import { useCveStore } from '@/stores/cve';
import { useUserStore } from '@/stores/user';
import { useMenu } from '@/hooks/useMenu';
import type { MessageItem } from '@/tools/im/types';
import { messageTypes } from '@/tools/im/constants/messageContentType';
import { useCopy } from '@/hooks/useCopy';

type msgMenusType = {
  title: string;
  icon: string;
  method: () => void;
  hidden: boolean;
};
const { openMenu } = useMenu();
const { copyFun } = useCopy();
const cveStore = useCveStore();
const userStore = useUserStore();
const msgListRef = ref<Ref>();
const menuOffset = ref({
  offsetLeft: 0,
  offsetWidth: 0,
  clientX: 0,
  clientY: 0,
});
const curClickMsg = ref<MessageItem>();
const canCpTypes = [messageTypes.TEXTMESSAGE, messageTypes.ATTEXTMESSAGE];
const canDownloadTypes = [
  messageTypes.PICTUREMESSAGE,
  messageTypes.VIDEOMESSAGE,
  messageTypes.FILEMESSAGE,
];
const canHiddenTypes = ['复制', '翻译', '回复'];

const forwardMsg = () => {};

const copyTextFun = () => {
  copyFun(
    curClickMsg.value.contentType === messageTypes.ATTEXTMESSAGE
      ? curClickMsg.value.atElem.text
      : curClickMsg.value.content
  );
};

const mutilMsg = () => {};

const replayMsg = () => {};

const revMsg = () => {};

const delComfirm = () => {};

const downloadFile = () => {};

// 右键列表
const msgMenus = ref<msgMenusType[]>([
  {
    title: '转发',
    icon: 'openIM-31zhuanfa',
    method: forwardMsg,
    hidden: false,
  },
  {
    title: '复制',
    icon: 'openIM-wenbenkuang_fuzhi',
    method: copyTextFun,
    hidden: false,
  },
  {
    title: '多选',
    icon: 'openIM-yunongtongduoxuanxuanzhong',
    method: mutilMsg,
    hidden: false,
  },
  {
    title: '回复',
    icon: 'openIM-message4',
    method: replayMsg,
    hidden: false,
  },
  {
    title: '撤回',
    icon: 'openIM-withdraw',
    method: revMsg,
    hidden: false,
  },
  {
    title: '删除',
    icon: 'openIM-remove2',
    method: delComfirm,
    hidden: false,
  },
  {
    title: '下载',
    icon: 'openIM-xiazai',
    method: downloadFile,
    hidden: false,
  },
]);

const isSelf = (sendID: string) => {
  return userStore.selfInfo.userID === sendID;
};

const switchMenu = () => {
  console.log(curClickMsg.value?.contentType);

  const tmp = msgMenus.value.map((menu) => {
    menu.hidden = false;
    if (
      !canCpTypes.includes(curClickMsg.value?.contentType) &&
      canHiddenTypes.includes(menu.title)
    ) {
      console.log(menu.title);
      menu.hidden = true;
    }

    // 图片、文件、视频类型可提供下载
    if (
      menu.title === '下载' &&
      !canDownloadTypes.includes(curClickMsg.value?.contentType)
    ) {
      menu.hidden = true;
    }

    // 是本人发的可进行撤销
    if (!isSelf(curClickMsg.value.sendID) && menu.title === '撤回') {
      menu.hidden = true;
    }
    return menu;
  });
  console.log(tmp);
  msgMenus.value = tmp;
};

// console.log();
const openMsgMenu = (e, curMsg: MessageItem) => {
  curClickMsg.value = curMsg;
  switchMenu();
  const offset = openMenu(e, msgListRef);
  menuOffset.value = offset;
};
</script>

<style>
.chat_bg {
  padding: 90px 20px 230px 20px;
  background-color: var(--im-theme-chatPageBg);
  display: flex;
  flex-flow: column-reverse;
}
</style>

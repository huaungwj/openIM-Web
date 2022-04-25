<template>
  <main class="chat_bg" ref="msgListRef">
    <!-- 信息列表 -->

    <MsgItem
      v-for="msg in cveStore.historyMsgList"
      :key="msg.clientMsgID"
      :msg="msg"
      :mutilSelect="mutilSelect"
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

    <!-- 合并转发后消息预览模态框 -->
    <MergeFMsgModal />
  </main>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import MsgItem from '@/views/Home/Cve/ChatPage/components/MsgItem.vue';
import ContextMenu from '@/components/ContextMenu/ContextMenu.vue';
import MergeFMsgModal from '@/components/MergeFMsgModal/MergeFMsgModal.vue';
import { useCveStore } from '@/stores/cve';
import { useUserStore } from '@/stores/user';
import { useMessage, useDialog } from 'naive-ui';
import { useMenu } from '@/hooks/useMenu';
import type {
  MessageItem,
  MergerMsgParams,
  FriendItem,
  GroupMemberItem,
  GroupItem,
} from '@/tools/im/types';
import {
  messageTypes,
  tipsTypes,
} from '@/tools/im/constants/messageContentType';
import { useCopy } from '@/hooks/useCopy';
import { useCommonStore } from '@/stores/common';
import { im } from '@/tools';
import { useUploadFile } from '@/hooks/useUploadFile';
import Bus from '@/tools/bus';
import { downloadFileUtil } from '@/tools/tools';
import { specialMsg } from '@/tools';

/**
 * types
 */
type msgMenusType = {
  title: string;
  icon: string;
  method: () => void;
  hidden: boolean;
};
type SelectType = FriendItem | GroupMemberItem | GroupItem;

const { openMenu } = useMenu();
const { copyFun } = useCopy();
const { sendMsg } = useUploadFile();
const cveStore = useCveStore();
const userStore = useUserStore();
const commonStore = useCommonStore();
const dialog = useDialog();
const message = useMessage();
const msgListRef = ref<Ref>();
// 是否要进行选择
const mutilSelect = ref<boolean>(false);
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

const forwardMsg = () => {
  commonStore.setcreateGARelayMTpye('forwardMsg');
  Bus.$emit('FORWARDMSG', { messageList: [curClickMsg.value] });
};

const copyTextFun = () => {
  copyFun(
    curClickMsg.value!.contentType === messageTypes.ATTEXTMESSAGE
      ? curClickMsg.value!.atElem.text
      : curClickMsg.value!.content
  );
};

const mutilMsg = () => {
  Bus.$emit('MUTILMSG', true);
};

const replayMsg = () => {
  Bus.$emit('REPLAYMSG', curClickMsg.value);
};

const revMsg = () => {
  // 撤回一条消息
  im.revokeMessage(JSON.stringify(curClickMsg.value))
    .then(() => {
      // 待完成
      revokeMyMsgHandler(curClickMsg.value.clientMsgID);
    })
    .catch((err) => message.error('撤回信息失败'));
};

const revokeMyMsgHandler = (clientMsgID: string) => {
  const idx = cveStore.historyMsgList.findIndex(
    (h) => h.clientMsgID === clientMsgID
  );
  cveStore.historyMsgList[idx].contentType = tipsTypes.REVOKEMESSAGE;
};

const delComfirm = (msg: MessageItem) => {
  // 打开对话框
  dialog.warning({
    title: '警告',
    content: `你确定要和删除 '${curClickMsg.value?.senderNickname}' 发的这条信息吗？`,
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: () => {
      Bus.$emit('DELMSG', msg);
      return true;
    },
    onNegativeClick: () => {
      // message.error('不确定');
    },
  });
};

const delMsg = (msg: MessageItem) => {
  im.deleteMessageFromLocalStorage(JSON.stringify(msg))
    .then((res) => {
      const idx = cveStore.historyMsgList.findIndex(
        (h) => h.clientMsgID === msg?.clientMsgID
      );
      let tmpList = [...cveStore.historyMsgList];
      tmpList.splice(idx, 1);
      cveStore.setHistoryMsgList(tmpList);
      message.success('删除成功！');
    })
    .catch((err) => message.error('删除消息失败'));
};

const downloadFile = () => {
  // 打开新窗口进行下载
  let downloadUrl = '';
  const msg = curClickMsg.value;
  switch (msg.contentType) {
    case messageTypes.PICTUREMESSAGE:
      downloadUrl = msg.pictureElem.sourcePicture.url;
      break;
    case messageTypes.VIDEOMESSAGE:
      downloadUrl = msg.videoElem.videoUrl;
      break;
    case messageTypes.FILEMESSAGE:
      downloadUrl = msg.fileElem.sourceUrl;
      break;
    default:
      break;
  }
  message.success('下载中...请耐心等待');
  const idx = downloadUrl.lastIndexOf('/');
  const fileName = downloadUrl.slice(idx + 1);
  downloadFileUtil(downloadUrl, fileName);
};

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
    method: () => {
      delComfirm(curClickMsg.value);
    },
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
  if (specialMsg.includes(curMsg.contentType)) return false;
  curClickMsg.value = curMsg;
  switchMenu();
  const offset = openMenu(e, msgListRef);
  menuOffset.value = offset;
};

/**
 * @param options 转发的消息参数配置
 * @param type 合并消息 | 转发消息
 * @param list 选中需要转发的人
 */
const sendForwardHandler = ({
  options,
  type,
  list,
}: {
  options: string | MergerMsgParams;
  type: messageTypes;
  list: SelectType[];
}) => {
  console.log(list, options, type);
  list.map(async (s) => {
    const uid = (s as FriendItem).userID ?? '';
    const gid = (s as GroupItem).groupID ?? '';
    let data;
    if (type === messageTypes.MERGERMESSAGE) {
      data = await im.createMergerMessage(options as MergerMsgParams);
    } else {
      data = await im.createForwardMessage(options as string);
    }
    // events.emit(MUTILMSG, false);
    sendMsg(data.data, type, uid, gid);
    Bus.$emit('MUTILMSG', false);
  });
};

onMounted(() => {
  Bus.$on('SENDFORWARDMSG', sendForwardHandler);
  Bus.$on('MUTILMSG', (type: boolean) => {
    mutilSelect.value = type;
  });
  Bus.$on('DELMSG', delMsg);
});
</script>

<style>
.chat_bg {
  padding: 90px 20px 230px 20px;
  background-color: var(--im-theme-chatPageBg);
  display: flex;
  flex-flow: column-reverse;
}
</style>

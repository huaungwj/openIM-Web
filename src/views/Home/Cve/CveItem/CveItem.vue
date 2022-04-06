<template>
  <div class="cve_item" @click="openCveWindowFun">
    <div class="left">
      <n-badge
        :value="isRecv(cve.recvMsgOpt) ? cve.unreadCount : null"
        show-zero
      >
        <MyAvatar :src="cve.faceURL" :size="40" />
      </n-badge>
      <div class="cve_info">
        <p class="info_title">{{ cve.showName }}</p>
        <p class="info_msg" v-html="parseLastMessage(cve.recvMsgOpt)"></p>
      </div>
    </div>

    <p>{{ $day(cve.latestMsgSendTime).fromNow() }}</p>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import MyAvatar from '@/components/myAvatar/MyAvatar.vue';
import type { ConversationItem, MessageItem } from '@/tools/im/types';
import { OptType } from '@/tools/im/types';
import { parseMessageType } from '@/tools/imT';
import { useUserStore } from '@/stores/user';
import { useCveStore } from '@/stores/cve';
import { useContactsStore } from '@/stores/contacts';
import { isSingleCve } from '@/tools';

const props = defineProps<{
  cve: ConversationItem;
}>();

const userStore = useUserStore();
const cveStore = useCveStore();
const contactsStore = useContactsStore();
const isRecv = (opt: OptType) => opt === OptType.Nomal;

// 消息类型处理
const parseLatestMsg = (lmsg: string): string => {
  if (lmsg === '') return lmsg;
  const pmsg: MessageItem = JSON.parse(lmsg);

  if (props.cve.draftText !== '') {
    let text = props.cve.draftText;
    const pattern = /\<img.*?\">/g;
    const matchArr = text.match(pattern);
    if (matchArr && matchArr.length > 0) {
      matchArr.map((matchRes) => {
        text = text.replaceAll(matchRes, '[图片]');
      });
    }
    return '[草稿]' + ' ' + text;
  }
  return parseMessageType(pmsg, userStore.selfInfo.userID);
};

// 消息的推送状态
const parseLastMessage = (recvMsgOpt) => {
  return isRecv(recvMsgOpt)
    ? parseLatestMsg(props.cve.latestMsg)
    : props.cve.unreadCount > 0
    ? `[${props.cve.unreadCount + ''}] ${parseLatestMsg(props.cve.latestMsg)}`
    : parseLatestMsg(props.cve.latestMsg);
};

// 打开会话窗口
const openCveWindowFun = () => {
  if (props.cve.conversationID === cveStore.curCve?.conversationID) return;
  cveStore.setCurCve(props.cve);
  // 获取群员信息
  getInfo(props.cve);
};

const getInfo = (cve: ConversationItem) => {
  if (!isSingleCve(cve)) {
    contactsStore.getGroupInfo(cve.groupID);
    const options = {
      groupID: cve.groupID,
      offset: 0,
      filter: 0,
      count: 2000,
    };
    // 获取群成员列表
    contactsStore.getGroupMemberList(options);
  }
};

console.log(JSON.parse(props.cve.latestMsg));
</script>

<style lang="css">
.cve_item {
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 20px 15px 20px 20px;
  background-color: var(--im-theme-cveItemBg);
  border-bottom: 1px solid var(--im-theme-chatPageSolid);
  cursor: pointer;
}
.cve_item:hover {
  background-color: var(--color-border);
}
.cve_item > p {
  color: var(--color-text);
  font-size: 13px;
}

.cve_item > .left {
  display: flex;
}

.cve_item > .left > .cve_info {
  font-size: 12px;
  padding-left: 15px;
}
.cve_info > .info_title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-heading);
}
.cve_info > .info_msg {
  color: var(--color-text);
}
</style>

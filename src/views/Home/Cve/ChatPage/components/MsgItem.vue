<template>
  <div>
    <div
      :class="`msg_item ${
        (msg.sendID === userStore.selfInfo.userID && 'reversal_msg') ||
        'default_msg'
      }`"
      v-if="
        msg.contentType !== tipsTypes.FRIENDADDED &&
        msg.contentType !== tipsTypes.MEMBERENTER &&
        msg.contentType !== tipsTypes.GROUPINFOUPDATED &&
        msg.contentType !== tipsTypes.REVOKEMESSAGE &&
        msg.contentType !== tipsTypes.GROUPCREATED
      "
    >
      <MyAvatar :src="msg.senderFaceUrl" :size="40" />
      <SwitchMsgType :msg="msg" :key="msg.clientMsgID" :msgIsRead="msgIsRead" />
    </div>

    <div class="n_msg_item" v-else>
      <!-- 创建了群聊 -->
      <div v-if="msg.contentType === tipsTypes.GROUPCREATED">
        <a>{{
          userStore.selfInfo.userID === msg.sendID
            ? '你'
            : JSON.parse(JSON.parse(props.msg.content).jsonDetail)
                .groupOwnerUser.nickname
        }}</a>
        创建了群聊
      </div>
      <!-- 撤回消息 -->
      <div
        class="revoke_message"
        v-if="msg.contentType === tipsTypes.REVOKEMESSAGE"
      >
        <a>{{ msg.senderNickname }}</a>
        撤回了一条消息
      </div>
      <!-- 新成员加入 -->
      <div
        class="new_member_join"
        v-if="msg.contentType === tipsTypes.MEMBERENTER"
      >
        <a>{{
          JSON.parse(msg.notificationElem.detail).entrantUser.nickname
        }}</a>
        加入了群聊
      </div>

      <!-- 修改群信息 -->
      <div
        class="update_group_info"
        v-if="msg.contentType === tipsTypes.GROUPINFOUPDATED"
      >
        <a> {{ JSON.parse(msg.notificationElem.detail).opUser.nickname }}</a>

        修改群信息
      </div>

      <!-- 添加好友信息 -->
      <div
        class="chat_bg_tips"
        v-if="msg.contentType === tipsTypes.FRIENDADDED"
      >
        你们已经是好友啦，开始聊天吧~
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, watch } from 'vue';

import MyAvatar from '@/components/myAvatar/MyAvatar.vue';
import type { MessageItem } from '@/tools/im/types';
import SwitchMsgType from '@/views/Home/Cve/ChatPage/components/SwitchMsgType.vue';
import { useUserStore } from '@/stores/user';
import { useCveStore } from '@/stores/cve';
import { tipsTypes } from '@/tools/im/constants/messageContentType';
import { im } from '@/tools';

const props = defineProps<{ msg: MessageItem }>();
const cveStore = useCveStore();
const userStore = useUserStore();
const msgIsRead = ref<boolean>(props.msg.isRead);

// 设置已读
const markC2CHasRead = (userID: string, msgID: string) => {
  if (props.msg.groupID) return;
  // console.log(cveStore.curCve.groupID, props.msg);
  msgIsRead.value = true;
  im.markC2CMessageAsRead({ userID, msgIDList: [msgID] });
};

onMounted(() => {
  if (
    cveStore.curCve &&
    cveStore.curCve.userID === props.msg.sendID &&
    !props.msg.isRead
  ) {
    markC2CHasRead(props.msg.sendID, props.msg.clientMsgID);
  }
});

watch(
  () => cveStore.curCve,
  () => {
    if (
      cveStore.curCve &&
      cveStore.curCve.userID === props.msg.sendID &&
      !props.msg.isRead
    ) {
      markC2CHasRead(props.msg.sendID, props.msg.clientMsgID);
    }
  }
);
</script>

<style>
/* 消息盒子 */
.msg_item {
  display: flex;
  margin: 10px 0;
}

.reversal_msg {
  flex-flow: row-reverse;
  margin-right: 25px;
}

.chat_bg .chat_bg_tips,
.chat_bg .index_con_nomore__Hfico,
.n_msg_item {
  font-size: 12px;
  text-align: center;
  color: var(--color-text);
  padding: 10px 0;
}

.n_msg_item a {
  color: var(--im-theme-primary);
}
</style>

<template>
  <div
    :class="`cve_item ${
      cve.conversationID === cveStore.curCve?.conversationID && 'active_cve'
    } ${cve.isPinned && 'pinned'}`"
    @click="clickCveItem"
  >
    <div class="left">
      <n-badge
        :value="isRecv(cve.recvMsgOpt) ? cve.unreadCount : null"
        :dot="!isRecv(cve.recvMsgOpt) && cve.unreadCount > 0"
      >
        <MyAvatar :src="cve.faceURL" :size="40" />
      </n-badge>
      <div class="cve_info">
        <p class="info_title">
          {{ cve.showName }}
          <n-tag type="info" size="small" v-show="!isSingleCve(cve)">
            群聊
          </n-tag>
        </p>
        <p class="info_msg" v-html="parseLastMessage(cve.recvMsgOpt)"></p>
      </div>
    </div>
    <div>
      <p style="font-size: 12px">{{ $day(cve.latestMsgSendTime).fromNow() }}</p>

      <p
        style="text-align: right; padding-top: 5px"
        v-show="cve.recvMsgOpt !== 0"
      >
        <svg
          class="icon"
          style="cursor: pointer; width: 15px; height: 15px"
          aria-hidden="true"
        >
          <use xlink:href="#openIM-miandarao1"></use>
        </svg>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, nextTick, watch } from 'vue';
import MyAvatar from '@/components/myAvatar/MyAvatar.vue';
import type { ConversationItem, MessageItem } from '@/tools/im/types';
import { OptType } from '@/tools/im/types';
import { parseMessageType } from '@/tools/imT';
import { useUserStore } from '@/stores/user';
import { useCveStore } from '@/stores/cve';
import { useContactsStore } from '@/stores/contacts';
import { useOpenCveWindow } from '@/hooks/useOpenCveWindow';
import { useScroll } from '@/hooks/useScroll';
import { isSingleCve } from '@/tools';

const props = defineProps<{
  cve: ConversationItem;
}>();

const userStore = useUserStore();
const cveStore = useCveStore();
const contactsStore = useContactsStore();
const { openCveWindow } = useOpenCveWindow();
const { scrollTo } = useScroll();
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

const clickCveItem = () => {
  openCveWindow(props.cve);
};

// 消息的推送状态
const parseLastMessage = (recvMsgOpt) => {
  return isRecv(recvMsgOpt)
    ? parseLatestMsg(props.cve.latestMsg)
    : props.cve.unreadCount > 0
    ? `[${props.cve.unreadCount + ''}条] ${parseLatestMsg(props.cve.latestMsg)}`
    : parseLatestMsg(props.cve.latestMsg);
};

watch([() => cveStore.historyMsgList], () => {
  if (cveStore.isPullMore && cveStore.cveContentRef.scrollHeight !== 0) {
    return nextTick(() => {
      cveStore.cveContentRef.scrollTop =
        cveStore.cveContentRef.scrollHeight - cveStore.cveCScHeight;
    });
  }
  // 跳到底部
  nextTick(() => {
    scrollTo('bottom');
  });
});
</script>

<style lang="css">
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

.active_cve {
  background-color: var(--im-theme-activeCveBg);
  /* border: 1px solid var(--im-theme-primary); */
}

/* 置顶 */
.pinned {
  background-color: var(--im-theme-fileMsgBg);
}
</style>

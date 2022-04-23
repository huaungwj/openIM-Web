<template>
  <div class="chat_msg_content">
    <p class="nike" v-if="!isSingleCve(cveStore.curCve)">
      {{ msg.senderNickname }}
    </p>
    <div style="display: flex">
      <!-- 文本类型 -->
      <div
        class="text_type"
        v-if="msg.contentType === messageTypes.TEXTMESSAGE"
      >
        <!-- 消息内容和时间 -->
        <div class="chat_msg_info">
          <span class="chat_msg_text" v-html="parseTextFun(msg.content)">
          </span>
        </div>
      </div>
      <!-- 图片 -->
      <div
        class="img_type"
        v-if="msg.contentType === messageTypes.PICTUREMESSAGE"
      >
        <n-image
          width="100"
          :src="
            msg.pictureElem.snapshotPicture.url
              ? msg.pictureElem.snapshotPicture.url
              : msg.pictureElem.sourcePicture.url
          "
          :preview-src="msg.pictureElem.bigPicture.url"
          :on-load="imageLoad"
          fallback="data:image/png;base64,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"
        />
      </div>
      <!-- 视频消息 -->
      <div
        :id="msg.videoElem.snapshotUUID"
        v-if="msg.contentType === messageTypes.VIDEOMESSAGE"
      ></div>
      <!-- 文件消息 -->
      <div
        class="file_type"
        v-if="msg.contentType === messageTypes.FILEMESSAGE"
      >
        <FileMsgVue :msg="msg" />
      </div>
      <!-- 群聊中的@类型消息 -->
      <div
        class="at_type"
        v-if="msg.contentType === messageTypes.ATTEXTMESSAGE"
      >
        <span v-html="parseAt(msg.atElem.text)"></span>
      </div>
      <!-- 合并转发类型消息 -->
      <div
        class="merger_type"
        v-if="msg.contentType === messageTypes.MERGERMESSAGE"
        @click="clickMerge"
      >
        <div className="title">{{ msg.mergeElem.title }}</div>
        <div className="content">
          <div
            class="marger_item"
            v-for="item in msg.mergeElem.abstractList"
            :key="item"
          >
            <span v-html="item"></span>
          </div>
        </div>
      </div>
      <!-- 名片消息 -->
      <div
        class="card_type"
        v-if="msg.contentType === messageTypes.CARDMESSAGE"
        @click="showUserCard(JSON.parse(msg.content).userID)"
      >
        <div class="card_info">
          <MyAvatar :src="JSON.parse(msg.content).faceURL" :size="32" />
          <div style="display: flex; flex-direction: column">
            <span class="card_info_name">{{
              JSON.parse(msg.content).nickname
            }}</span
            ><span class="card_info_name">{{
              JSON.parse(msg.content).userID
            }}</span>
          </div>
        </div>
        <hr />

        <p class="title">个人名片</p>
      </div>
      <!-- 地理位置类型消息 -->
      <div
        class="location_type"
        v-if="msg.contentType === messageTypes.LOCATIONMESSAGE"
      >
        地理消息
      </div>
      <!-- 自定义消息 -->
      <div
        class="custom_type"
        v-if="msg.contentType === messageTypes.CUSTOMMESSAGE"
      >
        自定义消息
      </div>

      <!-- 已读回执类型消息 -->
      <div
        class="read_type"
        v-if="msg.contentType === messageTypes.HASREADRECEIPTMESSAGE"
      >
        已读回执
      </div>
      <!-- 引用类型消息 -->
      <div
        class="quqte_type"
        v-if="msg.contentType === messageTypes.QUOTEMESSAGE"
      >
        <!-- 引用消息 -->
        <div class="quqte_content">
          回复{{ msg.quoteElem.quoteMessage.senderNickname }}:
          <p
            class="qut_text"
            v-if="
              msg.quoteElem.quoteMessage.contentType ===
              messageTypes.TEXTMESSAGE
            "
          >
            <span v-html="parseQute(msg.quoteElem.quoteMessage)"></span>
          </p>
          <p
            class="qut_at"
            v-if="
              msg.quoteElem.quoteMessage.contentType ===
              messageTypes.ATTEXTMESSAGE
            "
            v-html="parseQute(msg.quoteElem.quoteMessage)"
          ></p>
          <span
            class="qut_pic"
            v-if="
              msg.quoteElem.quoteMessage.contentType ===
              messageTypes.PICTUREMESSAGE
            "
          ></span>
        </div>
        <!-- 发送的消息 只对文本生效 -->
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <span
            class="send_msg"
            v-html="parseTextFun(msg.quoteElem.text)"
          ></span>
        </div>
      </div>
      <!-- 已读 | 未读 -->
      <div
        class="is_read_c"
        v-if="
          !msg.groupID &&
          [1, 2].some((item) => item === msg.status) &&
          msg.sendID === userStore.selfInfo.userID
        "
      >
        {{ msg.isRead ? '已读' : '未读' }}
      </div>
      <!-- 已删除，发送不成功显示 -->
      <div class="is_read_c" v-if="[3, 4].some((item) => item === msg.status)">
        <n-tooltip trigger="hover">
          <template #trigger>
            <svg class="icon" style="cursor: pointer" aria-hidden="true">
              <use xlink:href="#openIM-cuowutishi"></use>
            </svg>
          </template>
          发送失败或者对方已把你拉黑
        </n-tooltip>
      </div>
    </div>

    <span class="chat_msg_time">{{ $day(msg.sendTime).format('HH:mm') }}</span>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, onMounted } from 'vue';
import { messageTypes } from '@/tools/im/constants/messageContentType';
import type { MessageItem } from '@/tools/im/types';
import { useCveStore } from '@/stores/cve';
import { useUserStore } from '@/stores/user';
import { isSingleCve } from '@/tools';
import { faceMap } from '@/tools/face';
import { useContactsStore } from '@/stores/contacts';
import Player from 'xgplayer/dist/simple_player';
import volume from 'xgplayer/dist/controls/volume';
import playbackRate from 'xgplayer/dist/controls/playbackRate';
import pip from 'xgplayer/dist/controls/pip';
import FileMsgVue from '@/views/Home/Cve/ChatPage/components/FileMsg.vue';
import { useScroll } from '@/hooks/useScroll';
import Bus from '@/tools/bus';
import MyAvatar from '../../../../../components/myAvatar/MyAvatar.vue';

const cveStore = useCveStore();
const contactsStore = useContactsStore();
const userStore = useUserStore();
const { scrollTo } = useScroll();
const isImage = ref<boolean>(false);

const props = defineProps<{ msg: MessageItem; msgIsRead?: boolean }>();

const parseEmojiFace = (mstr: string) => {
  faceMap.map((f) => {
    const idx = mstr.indexOf(f.context);

    if (idx > -1) {
      mstr = mstr.replaceAll(
        f.context,
        `<img style="padding-right:2px" width="24px" src=${f.src} />`
      );
      isImage.value = true;
    }
  });

  return mstr;
};

const parseAt = (mstr: string) => {
  const pattern = /@\S+\s/g;
  const arr = mstr.match(pattern);
  arr?.map((a) => {
    const member = contactsStore.groupMemberList.find(
      (gm) => gm.userID === a.slice(1, -1)
    );
    if (member) {
      mstr = mstr.replaceAll(
        a,
        `<span onclick='seeDetailInfo("${member.userID.replace(
          '.',
          '-'
        )}")' style="color:#428be5;cursor: pointer;"> @${
          member.nickname
        } </span>`
      );
    }
  });
  return mstr;
};

const showUserCard = (userID: string) => {
  cveStore.setFriCardStatus(true);
  cveStore.setFriIDCard(userID);
};

// 查看详细信息
window.seeDetailInfo = (userID: string) => {
  // 单会话
  cveStore.setFriIDCard(userID);
  cveStore.setFriCardStatus(true);
};

// 换行转换
const parseBr = (mstr: string) => {
  const text = mstr.replaceAll('\\n', '<br>');
  return text.replaceAll('\n', '<br>');
};

const parseUrl = (mstr: string) => {
  const pattern =
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:._\+-~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:_\+.~#?&\/\/=]*)/g;
  const arr = mstr.match(pattern);
  arr?.map((a) => {
    mstr = mstr.replaceAll(
      a,
      `<a onclick="urlClick('${a}')" href="javascript:;">${a}</a>`
    );
  });
  return mstr;
};

// 对文本进行重排
const parseTextFun = (content): string => {
  let atMsg = content;
  atMsg = parseEmojiFace(atMsg);

  if (!isImage.value) atMsg = parseUrl(atMsg);

  atMsg = parseBr(atMsg);
  return atMsg;
};

// 引用类型
const parseQute = (quMsg: MessageItem) => {
  switch (quMsg.contentType) {
    case messageTypes.TEXTMESSAGE: {
      return parseTextFun(quMsg.content);
    }
    case messageTypes.ATTEXTMESSAGE: {
      return parseAt(quMsg.atElem.text);
    }
    case messageTypes.PICTUREMESSAGE: {
      return quMsg.pictureElem.sourcePicture.url;
    }
  }
};

const imageLoad = () => {
  if (
    cveStore.cveCscHeight === cveStore.cveContentRef.scrollHeight ||
    cveStore.isPullMore
  )
    return;
  scrollTo('bottom');
  cveStore.setCveCScHeiht(cveStore.cveContentRef.scrollHeight);
};

const clickMerge = () => {
  Bus.$emit('PREVIEWMERGEMSG', {
    type: true,
    mutilMsgArrTmp: props.msg.mergeElem.multiMessage,
  });
};

onMounted(() => {
  if (props.msg.videoElem?.videoUrl) {
    let player = new Player({
      id: props.msg.videoElem.snapshotUUID,
      url: props.msg.videoElem.videoUrl,
      controlPlugins: [volume, playbackRate, pip],
      pip: true,
      playbackRate: [0.5, 0.75, 1, 1.5, 2], //传入倍速可选数组
      lang: 'zh-cn',
      videoInit: true,
    });
  }
});
</script>

<style>
/* 右边内容部分 */
.chat_msg_content {
  /* position: relative; */
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

/* 是否已读 */
.chat_msg_content .is_read_c {
  padding: 10px 0px 0 10px;
  font-size: 12px;
  color: var(--color-text);
}

.reversal_msg > .chat_msg_content > div {
  flex-flow: row-reverse;
}
.reversal_msg > .chat_msg_content .is_read_c {
  padding: 10px 10px 0 0;
}
/* 昵称 */
.chat_msg_content .nike {
  color: var(--color-text);
  font-size: 13px;
}

/* 消息内容盒子 */
.chat_msg_content .chat_msg_info,
.chat_msg_content .quqte_type,
.chat_msg_content .card_type,
.chat_msg_content .at_type,
.chat_msg_content .merger_type {
  border-radius: 5px;
  background-color: var(--im-theme-chatMsgBg);
  padding: 5px 55px 10px 10px;
  display: flex;
  flex-direction: column;
}

/* ---------------------------------- 引用类型消息 --------------------------------------- */
.chat_msg_content .quqte_type,
.chat_msg_content .card_type {
  padding-right: 20px;
}
.chat_msg_content .quqte_type > .quqte_content {
  border-left: 2px solid var(--color-text);
  padding-left: 10px;
  margin-bottom: 10px;
}
.chat_msg_content > .chat_msg_time {
  font-size: 12px;
  color: var(--color-text);
}

/* ---------------------------------- 卡片类型消息 --------------------------------------  */
.chat_msg_content .card_type > .card_info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.chat_msg_content .card_type > .title {
  color: var(--color-text);
  padding-top: 10px;
  font-size: 12px;
}

.chat_msg_content .card_type > hr {
  margin-top: 7px;
  height: 1px;
  background-color: var(--color-text);
  border: none;
}

.chat_msg_content .card_type > .card_info .card_info_name {
  padding: 5px 20px 0px 10px;
  font-size: 12px;
  color: var(--color-text);
}

.reversal_msg .chat_msg_content .chat_msg_info,
.reversal_msg .chat_msg_content .quqte_type,
.reversal_msg .chat_msg_content .at_type {
  background-color: var(--im-theme-primary) !important;
  color: var(--im-cveItem-dark-color);
}

.default_msg > .chat_msg_content .chat_msg_info::before,
.default_msg .chat_msg_content .quqte_type::before,
.default_msg .chat_msg_content .card_type::before,
.default_msg .chat_msg_content .at_type::before {
  position: absolute;
  top: 10px;
  left: -15px;
  content: '';
  width: 0;
  height: 0;
  border-right: 8px solid var(--im-theme-chatMsgBg);
  border-bottom: 8px solid transparent;
  border-left: 8px solid transparent;
  border-top: 8px solid transparent;
}

/* 消息文本 */
.chat_msg_content .chat_msg_info .chat_msg_text {
  font-size: 14px;
}

/* 合并消息盒子 */
.chat_msg_content .merger_type .marger_item {
  font-size: 12px;
  color: var(--color-text);
}
.chat_msg_content .merger_type {
  cursor: pointer;
}

/* 时间 */
.chat_msg_content > .chat_msg_time {
  font-size: 12px;
  width: 100%;
  text-align: right;
  transform: scale(0.9);
}

.reversal_msg > .chat_msg_content > .chat_msg_time {
  text-align: left;
}

/* 自我 */
.reversal_msg > .chat_msg_content .chat_msg_info::before,
.reversal_msg .chat_msg_content .quqte_type::before,
.reversal_msg .chat_msg_content .at_type::before {
  right: -15px;
  position: absolute;
  top: 10px;
  content: '';
  width: 0;
  height: 0;
  border-bottom: 8px solid transparent;
  border-left: 8px solid var(--im-theme-primary);
  border-right: 8px solid transparent;
  border-top: 8px solid transparent;
}

.reversal_msg .chat_msg_content {
  padding-left: 0;
  padding-right: 15px;
}

.reversal_msg .chat_msg_content {
  justify-content: flex-end;
  align-items: flex-end;
}

.chat_msg_content a {
  color: var(--im-theme-primary);
}
</style>

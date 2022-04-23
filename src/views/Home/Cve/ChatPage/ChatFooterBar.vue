<template>
  <footer class="chat_footer" v-if="!mutilSelect">
    <!-- <n-input :style="{ width: '50%' }" />
    <n-button type="primary" ghost> 搜索 </n-button> -->
    <!-- 聊天框工具栏 -->
    <div class="chat_input_tools">
      <!-- 表情 -->
      <n-dropdown
        trigger="hover"
        placement="top"
        :options="emojiOptions"
        display-directive="show"
        :delay="0"
      >
        <div class="input_tools_emoji iconfont">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#openIM-emoji"></use>
          </svg>
        </div>
      </n-dropdown>
      <!-- 发送文件、图片、视频 -->
      <div class="input_tools_files">
        <n-upload :show-file-list="false" :custom-request="cusromSendFile">
          <svg class="icon iconfont" aria-hidden="true">
            <use xlink:href="#openIM-file-open"></use>
          </svg>
        </n-upload>
      </div>
      <!-- 信息搜索 -->
      <div class="input_tools_sear_msg">
        <svg class="icon iconfont" aria-hidden="true">
          <use xlink:href="#openIM-message"></use>
        </svg>
      </div>
      <!-- 名片 -->
      <div class="input_tools_scard" @click="clickSendCardFun">
        <svg class="icon iconfont" aria-hidden="true">
          <use xlink:href="#openIM-zhanghu"></use>
        </svg>
      </div>
    </div>

    <!-- 聊天框 -->
    <vue-tribute :options="mentionOptions" style="outline: none">
      <contenteditable
        class="chat_input"
        tag="div"
        :contenteditable="true"
        v-model="chatInputContext"
        :noHTML="false"
        :noNL="true"
        @keydown.enter="
          switchMessage(replyMsg ? 'quote' : atList.length > 0 ? 'at' : 'text')
        "
      ></contenteditable>
    </vue-tribute>

    <div class="reply" v-if="replyMsg">
      <div class="reply_text">
        回复：<span>{{ replyMsg.senderNickname }}:</span>
        {{ parseMsg(replyMsg) }}
      </div>
      <svg class="icon" @click="replyMsg = undefined">
        <use xlink:href="#openIM-close"></use>
      </svg>
    </div>
  </footer>
  <footer class="mutil_sel_con" v-else>
    <div class="forward" @click="forWardFun(false)">
      <svg class="icon iconfont" aria-hidden="true">
        <use xlink:href="#openIM-31zhuanfa"></use>
      </svg>
      逐条转发
    </div>
    <div class="merge_forward" @click="forWardFun(true)">
      <svg class="icon iconfont" aria-hidden="true">
        <use xlink:href="#openIM-zhuanfa_dark"></use>
      </svg>
      合并转发
    </div>
    <div class="merge_del">
      <svg class="icon iconfont" aria-hidden="true" @click="mutilDelMsg">
        <use xlink:href="#openIM-remove2"></use>
      </svg>
      删除
    </div>
    <div class="mutil_close" @click="closeMutil">
      <svg class="icon iconfont" aria-hidden="true">
        <use xlink:href="#openIM-guanbi"></use>
      </svg>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { h, ref, watch, reactive, onMounted } from 'vue';
import contenteditable from '@/views/Home/Cve/ChatPage/components/Contenteditable.vue';
import { VueTribute } from 'vue-tribute';
import { faceMap } from '@/tools/face';
import { NImage, useMessage, NScrollbar, NPopover } from 'naive-ui';
import { im, isSingleCve } from '@/tools';
import { messageTypes } from '@/tools/im/constants/messageContentType';
import { useCveStore } from '@/stores/cve';
import { useUploadFile } from '@/hooks/useUploadFile';
import { useContactsStore } from '@/stores/contacts';
import { useCommonStore } from '@/stores/common';
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import Bus from '@/tools/bus';
import type {
  MessageItem,
  GroupMemberItem,
  FriendItem,
} from '@/tools/im/types';

/**
 * 添加群成员 | 转发消息 > 合并消息 - 单发消息 | 创建群聊
 */

type mentionArrType = {
  key: string | number;
  value: string | number;
};

type FaceEmojiType = {
  context: string;
  src: string;
};

//use
const cveStore = useCveStore();
const contactsStore = useContactsStore();
const message = useMessage();
const commonStore = useCommonStore();
const { sendMsg, sendCosMsg } = useUploadFile();
// 聊天框内容
const chatInputContext = ref<string>(``);
// 艾特列表
const atList = ref<{ id: string; name: string; tag: string }[]>();
const replyMsg = ref<MessageItem | undefined>(undefined);
// 是否多选转发
const mutilSelect = ref<boolean>(false);
// 选中的msg
const mutilMsgArr = ref<MessageItem[]>([]);

function faceClick(face: FaceEmojiType, e: Event) {
  e.preventDefault();
  const faceEl = `<img class="face_el" alt="${face.context}" style="padding-right:2px" width="24px" src="${face.src}">`;
  // move2end(chatInputRef);
  chatInputContext.value = chatInputContext.value + faceEl;
}

const mentionOptions = reactive({
  trigger: '@',
  values: [],
  selectTemplate: (item: any) => {
    if (replyMsg.value) {
      replyMsg.value = undefined;
    }
    const tag = addAt('' + `@${item.original.value} ` + ' ');
    atList.value.push({
      id: item.original.value,
      name: item.original.key,
      tag: tag,
    });

    return tag;
  },
  noMatchTemplate: function () {
    return '<span style:"visibility: hidden;"></span>';
  },
});

// emoji配置文件
const emojiOptions = [
  {
    key: 'header',
    type: 'render',
    render: renderEmojiContent,
  },
];

function renderEmojiContent() {
  return h(NScrollbar, { style: 'max-height: 300px' }, () =>
    h(
      'div',
      {
        style: "boxShadow: '0px 4px 25px rgb(0 0 0 / 16%)'",
        class: 'face_container',
      },

      [
        faceMap.map((face: FaceEmojiType) => {
          return h(
            NPopover,
            {
              trigger: 'hover',
              animated: false,
              key: face.context,
            },
            {
              default: () => `${face.context}`,

              trigger: () =>
                h(
                  'div',
                  {
                    key: face.context,
                    onClick: (e: Event) => {
                      faceClick(face, e);
                    },
                    class: 'face_item',
                  },
                  [
                    h(NImage, {
                      'preview-disabled': true,
                      width: 26,
                      src: face.src,
                    }),
                  ]
                ),
            }
          );
        }),
      ]
    )
  );
}

// 对 img进行处理
const parseImg = (text: string) => {
  const pattern = /\<img.*?\">/g;
  const patternArr = text.match(pattern);

  if (patternArr && patternArr.length > 0) {
    patternArr.map((img) => {
      text = text.replaceAll(img, '');
    });
  }

  return text;
};

const parseEmojiFace = (text: string) => {
  const faceEls = [
    ...document.getElementsByClassName('face_el'),
  ] as HTMLImageElement[];
  if (faceEls.length > 0) {
    faceEls.map((face) => {
      text = text.replaceAll(face.outerHTML, face.alt);
    });
  }
  return text;
};

const parseBr = (mstr: string) => {
  if (mstr.slice(-4) === '<br>') {
    mstr = mstr.slice(0, -4);
  }
  mstr = mstr.replaceAll('<br>', '\n');
  return mstr;
};

const parseAt = (text: string) => {
  atList.value.map((at) => {
    text = text.replaceAll(at.tag, `@${at.id} `);
  });
  return text;
};

const addAt = (mstr: string) => {
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
        )}")' class='at_el' data_name="${member.nickname}" data_id="${
          member.userID
        }" contenteditable="false"> @${member.nickname} </span>`
      );
    }
  });
  return mstr;
};

const parseMsg = (msg: MessageItem) => {
  switch (msg.contentType) {
    case messageTypes.TEXTMESSAGE:
      return msg.content;
    case messageTypes.ATTEXTMESSAGE:
      return msg.atElem.text;
    case messageTypes.PICTUREMESSAGE:
      return '[图片消息]';
    case messageTypes.VIDEOMESSAGE:
      return '[视频消息]';
    case messageTypes.VOICEMESSAGE:
      return '[语音消息]';
    case messageTypes.LOCATIONMESSAGE:
      return '[位置信息]';
    case messageTypes.MERGERMESSAGE:
      return '[合并消息]';
    case messageTypes.FILEMESSAGE:
      return '[文件消息]';
    case messageTypes.QUOTEMESSAGE:
      return '[引用消息]';
    default:
      break;
  }
};

// 辨别消息的类型
const switchMessage = (type: string) => {
  let text = chatInputContext.value;
  text = parseImg(parseEmojiFace(text));
  text = parseBr(text);
  // text = parseAt(text);
  if (text === '') return;
  cveStore.setIsPullMore(false);
  switch (type) {
    case 'text': // 普通文本和表情
      sendTextMsg(text);
      break;

    case 'at':
      sendAtTextMsg(parseAt(text));
      break;

    case 'quote':
      quoteMsg(text);
      break;

    default:
      break;
  }
};

const sendTextMsg = async (text: string) => {
  const { data } = await im.createTextMessage(text);
  // 发送
  sendMsg(data, messageTypes.TEXTMESSAGE);
  // 重置状态
  resetData();
};

const sendAtTextMsg = async (text: string) => {
  const options = {
    text,
    atUserIDList: atList.value.map((au) => au.id),
  };
  const { data } = await im.createTextAtMessage(options);
  sendMsg(data, messageTypes.ATTEXTMESSAGE);
  // 重置状态
  resetData();
};

const quoteMsg = async (text: string) => {
  const { data } = await im.createQuoteMessage({
    text,
    message: JSON.stringify(replyMsg.value),
  });
  sendMsg(data, messageTypes.QUOTEMESSAGE);

  resetData();
};

// 自定义发送文件
const cusromSendFile = async (data: UploadRequestOption) => {
  if (!data) return;
  const fileList = ['image', 'video'];
  let type = data.file.type.split('/')[0];

  sendCosMsg(
    data.file?.file,
    fileList.some((item) => item === type) ? type : 'file'
  );
};

const contextChange = () => {
  const atels = [...document.getElementsByClassName('at_el')];
  let tmpAts: any = [];
  atels.map((at) =>
    tmpAts.push({
      id: at.attributes.getNamedItem('data_id')?.value,
      name: at.attributes.getNamedItem('data_name')?.value,
      tag: at.outerHTML,
    })
  );
  atList.value = tmpAts;
};

const resetData = () => {
  chatInputContext.value = '';
  atList.value = [];
  replyMsg.value = undefined;
};

/**
 * 转发函数
 * @param type 是否合并转发 true 是 | false 否
 */
const forWardFun = (type: boolean) => {
  if (mutilMsgArr.value.length === 0 || mutilMsgArr.value.length > 5)
    return message.warning('请输入1条并且不大于5条信息进行转发');
  commonStore.setcreateGARelayMTpye(type ? 'mergeForwardMsg' : 'forwardMsg');

  const sortedMsg = mutilMsgArr.value.sort((a, b) => a.sendTime - b.sendTime);
  if (type) {
    // 合并转发配置项
    let title;
    if (isSingleCve(cveStore.curCve)) {
      title = '与' + cveStore.curCve.showName + '的聊天记录';
    } else {
      title = `群聊 ${cveStore.curCve.showName} 的聊天记录`;
    }

    let tmm: string[] = [];
    const tmpArr = sortedMsg.length > 5 ? sortedMsg.slice(0, 4) : sortedMsg;
    tmpArr.map((m) => tmm.push(`${m.senderNickname}：${parseMsg(m)}`));

    const options = {
      messageList: [...sortedMsg],
      title,
      summaryList: tmm,
    };

    Bus.$emit('FORWARDMSG', options);
  } else {
    // 逐条转发
    Bus.$emit('FORWARDMSG', { messageList: sortedMsg });
  }
};

// 关闭多选
const closeMutil = () => {
  Bus.$emit('MUTILMSG', false);
};

// 批量删除msg
const mutilDelMsg = () => {
  if (mutilMsgArr.value.length < 0) return;
  mutilMsgArr.value.forEach((msg) => {
    Bus.$emit('DELMSG', msg);
    Bus.$emit('MUTILMSG', false);
  });
};

// 点击卡片
const clickSendCardFun = () => {
  commonStore.setcreateGARelayMTpye('sendCard');
};

const sendCardMsg = async (friend: FriendItem) => {
  console.log(friend);
  const { data } = await im.createCardMessage(JSON.stringify(friend));
  sendMsg(data, messageTypes.CARDMESSAGE);
};

watch(
  () => contactsStore.groupMemberList,
  () => {
    const tmp = contactsStore.groupMemberList.map((item: GroupMemberItem) => {
      return { key: item.nickname, value: item.userID };
    });
    mentionOptions.values = tmp;
  }
);

watch(
  () => chatInputContext.value,
  () => {
    contextChange();
  }
);

onMounted(() => {
  // 回复
  Bus.$on('REPLAYMSG', (data: MessageItem) => {
    replyMsg.value = data;
  });
  // 改变多选状态
  Bus.$on('MUTILMSG', (type: boolean) => {
    mutilSelect.value = type;
    if (type) mutilMsgArr.value = [];
  });
  // 选中消息触发
  Bus.$on(
    'MUTILMSGCHANGE',
    ({ msg, checked }: { msg: MessageItem; checked: boolean }) => {
      if (checked) {
        mutilMsgArr.value?.push(msg);
      } else {
        const tmp = mutilMsgArr.value?.filter(
          (item) => item.clientMsgID !== msg.clientMsgID
        );
        mutilMsgArr.value = tmp;
      }
    }
  );
  // 发送卡片消息
  Bus.$on('SENDCARDMSG', sendCardMsg);
});
</script>

<style>
.chat_footer,
.mutil_sel_con {
  position: fixed;
  bottom: 0;
  width: 69%;
  height: 200px;
  z-index: 116;
  background-color: var(--im-theme-chatPageBg);
  border-top: 1px solid var(--im-theme-chatPageSolid);
  padding-left: 20px;
}

.mutil_sel_con {
  display: flex;
  justify-content: center;
  align-items: center;
}

.mutil_sel_con > div {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-right: 20px;
  width: 95px;
  height: 95px;
  background-color: var(--im-theme-cveItemBg);
  border-radius: 50%;
  font-size: 12px;
  cursor: pointer;
}

.chat_footer input[type='file'] {
  display: none;
}

/* 聊天框工具栏 */
.chat_footer > .chat_input_tools {
  padding-top: 10px;
  width: 20%;
  height: 35%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 图标 */
.chat_footer .iconfont {
  font-size: 20px;
  cursor: pointer;
}

.chat_footer .iconfont:hover {
  color: var(--im-theme-primary);
}
/* 输入框 */
.chat_footer .chat_input {
  min-height: 34px;
  max-height: 50%;
  font-size: 14px;
  line-height: 1.5715;
  outline: none;
  overflow-y: scroll;
  word-break: auto;
  white-space: pre-wrap;
  transition: all 0.3s;
  -webkit-user-select: text;
  cursor: text;
}
/* 输入框滚动条 */
.chat_input::-webkit-scrollbar {
  width: 10px;
  /*height: 4px;*/
}
.chat_input::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(139, 139, 139, 0.2);
}
.chat_input::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0);
}

/* emoji内容 */
.face_container {
  width: 250px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  /* height: 300px;
  overflow-y: scroll; */
}
/* 表情 */
.face_container > .face_item {
  padding: 10px;
  text-align: center;
}
.face_container > .face_item:hover {
  /* background-color: rgba(255, 255, 255, 0.3); */
  background-color: var(--color-text);
  border-radius: 7px;
}
/* 艾特 节点 */
.at_el {
  color: #428be5;
  cursor: pointer;
}
/* 回复输入框样式 */
.chat_footer > .reply {
  display: flex;
  align-items: center;
}

.chat_footer > .reply > .reply_text {
  text-align: center;
  background-color: var(--im-theme-cveItemBg);
  padding: 10px 10px;
  border-radius: 8px;
}
.chat_footer > .reply > .icon {
  padding-left: 5px;
  width: 25px;
  height: 25px;
  cursor: pointer;
}
</style>

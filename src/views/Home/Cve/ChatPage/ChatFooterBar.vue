<template>
  <footer class="chat_footer">
    <!-- <n-input :style="{ width: '50%' }" />
    <n-button type="primary" ghost> 搜索 </n-button> -->
    <!-- 聊天框工具栏 -->
    <div class="chat_input_tools">
      <!-- 表情 -->
      <n-dropdown trigger="hover" placement="top" :options="emojiOptions">
        <div class="input_tools_emoji iconfont">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#openIM-emoji"></use>
          </svg>
        </div>
      </n-dropdown>
      <!-- 发送文件、图片、视频 -->
      <div class="input_tools_files">
        <svg class="icon iconfont" aria-hidden="true">
          <use xlink:href="#openIM-file-open"></use>
        </svg>
      </div>
      <!-- 信息搜索 -->
      <div class="input_tools_sear_msg">
        <svg class="icon iconfont" aria-hidden="true">
          <use xlink:href="#openIM-message"></use>
        </svg>
      </div>
      <!-- 名片 -->
      <div class="input_tools_scard">
        <svg class="icon iconfont" aria-hidden="true">
          <use xlink:href="#openIM-zhanghu"></use>
        </svg>
      </div>
    </div>

    <!-- 聊天框 -->

    <contenteditable
      class="chat_input"
      tag="div"
      :contenteditable="true"
      v-model="chatInputContext"
      :noHTML="false"
      :noNL="true"
      @keydown.enter="switchMessage('text')"
    />
  </footer>
</template>

<script setup lang="ts">
import { h, ref } from 'vue';
import contenteditable from '@/views/Home/Cve/ChatPage/components/Contenteditable.vue';
// import EmojiContent from './EmojiContent.vue';
import { faceMap } from '@/tools/face';
import { NImage, useMessage } from 'naive-ui';
import { im } from '@/tools';
import { messageTypes } from '@/tools/im/constants/messageContentType';
import { useCveStore } from '@/stores/cve';
import { useScroll } from '@/hooks/useScroll';
import { useUploadFile } from '@/hooks/useUploadFile';

//use
const cveStore = useCveStore();
const { scrollTo } = useScroll();
const message = useMessage();
const { sendMsg } = useUploadFile();
// 聊天框内容
const chatInputContext = ref<string>(``);

function faceClick(face, e) {
  e.preventDefault();
  const faceEl = `<img class="face_el" alt="${face.context}" style="padding-right:2px" width="24px" src="${face.src}">`;
  // move2end(chatInputRef);
  chatInputContext.value = chatInputContext.value + faceEl;
}

const emojiOptions = [
  {
    key: 'header',
    type: 'render',
    render: renderEmojiContent,
  },
];

function renderEmojiContent() {
  return h(
    'div',
    {
      style: "boxShadow: '0px 4px 25px rgb(0 0 0 / 16%)'",
      class: 'face_container',
    },
    [
      faceMap.map((face) => {
        return h(
          'div',
          {
            key: face.context,
            onClick: (e) => {
              faceClick(face, e);
            },
            class: 'face_item',
          },
          [h(NImage, { 'preview-disabled': true, width: 24, src: face.src })]
        );
      }),
    ]
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

// 辨别消息的类型
const switchMessage = (type: string) => {
  // console.log('发送', chatInputContext.value);
  let text = chatInputContext.value;
  text = parseImg(parseEmojiFace(text));
  text = parseBr(text);
  if (text === '') return;
  cveStore.setIsPullMore(false);
  switch (type) {
    case 'text': // 普通文本和表情
      sendTextMsg(text);
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

const resetData = () => {
  chatInputContext.value = '';
};

// watch(chatInputContext, (newValue) => {
//   console.log(newValue);
// });
</script>

<style>
.chat_footer {
  position: fixed;
  bottom: 0;
  width: 69%;
  height: 200px;
  z-index: 116;
  background-color: var(--im-theme-chatPageBg);
  border-top: 1px solid var(--im-theme-chatPageSolid);
  padding-left: 20px;
}

/* 聊天框工具栏 */
.chat_footer > .chat_input_tools {
  padding-top: 10px;
  width: 20%;
  height: 35%;
  display: flex;
  justify-content: space-between;
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
.chat_footer > .chat_input {
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
  width: 200px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
/* 表情 */
.face_container > .face_item {
  padding: 10px;
  text-align: center;
}
.face_container > .face_item:hover {
  /* background-color: rgba(255, 255, 255, 0.3); */
  background-color: var(--color-text);
}
</style>

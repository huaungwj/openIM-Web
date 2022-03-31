<template>
  <footer class="chat_footer">
    <!-- <n-input :style="{ width: '50%' }" />
    <n-button type="primary" ghost> 搜索 </n-button> -->
    <!-- 聊天框工具栏 -->
    <div class="chat_input_tools">
      <!-- 表情 -->
      <n-dropdown trigger="hover" placement="top" :options="emojiOptions">
        <div class="input_tools_emoji">
          <i class="iconfont openIM-emoji"></i>
        </div>
      </n-dropdown>
      <!-- 发送文件、图片、视频 -->
      <div class="input_tools_files">
        <i class="iconfont openIM-file-open"></i>
      </div>
      <!-- 信息搜索 -->
      <div class="input_tools_sear_msg">
        <i class="iconfont openIM-message"></i>
      </div>
      <!-- 名片 -->
      <div class="input_tools_scard">
        <i class="iconfont openIM-zhanghu"></i>
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
    />
  </footer>
</template>

<script setup lang="ts">
import { h, ref, watch } from 'vue';
// import EmojiContent from './EmojiContent.vue';
import { faceMap } from '@/tools/face';
import { NImage } from 'naive-ui';
import contenteditable from '@/views/Home/Cve/ChatPage/components/Contenteditable.vue';

// 聊天框内容
const chatInputContext = ref<string>(``);
// 聊天框元素

function faceClick(face, e) {
  e.preventDefault();
  const faceEl = `<img class="face_el" alt="${face.context}" style="padding-right:2px" width="24px" src="${face.src}">`;
  // move2end(chatInputRef);
  chatInputContext.value = chatInputContext.value + faceEl;
}

watch(chatInputContext, (newValue) => {
  console.log(newValue);
});

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

const emojiOptions = [
  {
    key: 'header',
    type: 'render',
    render: renderEmojiContent,
  },
];
</script>

<style>
.chat_footer {
  position: fixed;
  bottom: 0;
  width: 69%;
  height: 200px;
  z-index: 1;
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

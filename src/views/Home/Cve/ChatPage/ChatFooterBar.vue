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
      <div class="input_tools_scard">
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
        @keydown.enter="switchMessage('text')"
      />
    </vue-tribute>
  </footer>
</template>

<script setup lang="ts">
import { h, ref, watch, reactive } from 'vue';
import contenteditable from '@/views/Home/Cve/ChatPage/components/Contenteditable.vue';
import { VueTribute } from 'vue-tribute';
// import EmojiContent from './EmojiContent.vue';
import { faceMap } from '@/tools/face';
import { NImage, useMessage, NScrollbar, NTooltip } from 'naive-ui';
import { im } from '@/tools';
import { messageTypes } from '@/tools/im/constants/messageContentType';
import { useCveStore } from '@/stores/cve';
import { useScroll } from '@/hooks/useScroll';
import { useUploadFile } from '@/hooks/useUploadFile';
import { useContactsStore } from '@/stores/contacts';
import type { UploadRequestOption } from 'rc-upload/lib/interface';

type mentionArrType = {
  key: string | number;
  value: string | number;
};

//use
const cveStore = useCveStore();
const contactsStore = useContactsStore();
const { scrollTo } = useScroll();
const message = useMessage();
const { sendMsg, sendCosMsg } = useUploadFile();
// 聊天框内容
const chatInputContext = ref<string>(``);
// 艾特列表
const atList = ref<{ id: string; name: string; tag: string }[]>();

function faceClick(face, e) {
  e.preventDefault();
  const faceEl = `<img class="face_el" alt="${face.context}" style="padding-right:2px" width="24px" src="${face.src}">`;
  // move2end(chatInputRef);
  chatInputContext.value = chatInputContext.value + faceEl;
}

const mentionOptions = reactive({
  trigger: '@',
  values: [],
  selectTemplate: (item: any) => {
    console.log(item);
    const tag = parseAt('' + `@${item.original.value} ` + ' ');
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
        faceMap.map((face) => {
          return h(
            NTooltip,
            { trigger: 'hover' },
            {
              default: () => `${face.context}`,

              trigger: () =>
                h(
                  'div',
                  {
                    key: face.context,
                    onClick: (e) => {
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
        )}")' class='at_el' data_name="${member.nickname}" data_id="${
          member.userID
        }" contenteditable="false"> @${member.nickname} </span>`
      );
    }
  });
  return mstr;
};

// 辨别消息的类型
const switchMessage = (type: string) => {
  // console.log('发送', chatInputContext.value);
  let text = chatInputContext.value;
  text = parseImg(parseEmojiFace(text));
  text = parseBr(text);
  text = parseAt(text);
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
  console.log('发生变化了', atList.value);
};

const resetData = () => {
  chatInputContext.value = '';
};

watch(
  () => contactsStore.groupMemberList,
  () => {
    const tmp = contactsStore.groupMemberList.map((item) => {
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

.at_el {
  color: #428be5;
  cursor: pointer;
}
</style>

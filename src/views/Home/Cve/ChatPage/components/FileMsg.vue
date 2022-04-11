<template>
  <a class="file_msg" :href="msg.fileElem.filePath" target="_blank">
    <!-- 文件图标 -->
    <svg class="icon file_icon" aria-hidden="true">
      <use
        :xlink:href="`#openIM-${
          fileList.some((item) => item === fileExtension(msg.fileElem.fileName))
            ? fileExtension(msg.fileElem.fileName)
            : 'unknowfile'
        }`"
      ></use>
    </svg>
    <!-- <i :class="`iconfont `"></i> -->
    <!-- 文件名称、文件大小、发送时间 -->
    <div class="file_info">
      <p class="file_name">{{ msg.fileElem.fileName }}</p>
      <p class="file_size_time">
        <span class="file_size">{{ fileSizeTran(msg.fileElem.fileSize) }}</span>
        <span class="file_time">{{ $day(msg.sendTime).format('HH:mm') }}</span>
      </p>
    </div>
  </a>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import type { MessageItem } from '@/tools/im/types';
import { fileExtension, fileSizeTran } from '@/tools/tools';

const props = defineProps<{ msg: MessageItem }>();

const fileList = [
  'pdf',
  'docx',
  'txt',
  'xmind',
  'ics',
  'svg',
  'jpg',
  'png',
  'rar',
  '7z',
  'zip',
  'mp3',
  'gif',
  'xls',
  'md',
  'srt',
  'sql',
  'html',
  'js',
  'ts',
  'jsx',
  'tsx',
  'vue',
  'py',
];
</script>

<style>
.file_msg {
  display: flex;
  border-radius: 5px;
  padding: 15px 10px 10px 10px;
  background-color: var(--im-theme-chatMsgBg);
}

.reversal_msg .file_msg {
  background-color: var(--im-theme-fileMsgBg);
}
/* 图标 */
.file_msg > .file_icon {
  width: 2.5rem;
  height: 2.5rem;
}

.file_msg > .file_info {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  padding-left: 10px;
}

.file_msg > .file_info > .file_name {
  font-size: 14px;
  color: var(--color-heading);
}

.file_msg > .file_info > .file_size_time {
  padding-top: 5px;
  display: flex;
  justify-content: space-between;
  color: var(--color-text);
}
</style>

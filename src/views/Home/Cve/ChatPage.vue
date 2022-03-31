<template>
  <!-- 当前聊天会话框 -->
  <div class="chat_page_container">
    <!-- 头部用户信息栏 -->
    <ChatTopBar />
    <!-- 会话主体内容 -->
    <CharContent />
    <!-- 底部信息框 -->
    <CharFooterBar />
  </div>
</template>

<script lang="ts" setup>
import ChatTopBar from '@/views/Home/Cve/ChatPage/ChatTopBar.vue';
import CharContent from './ChatPage/CharContent.vue';
import CharFooterBar from '@/views/Home/Cve/ChatPage/ChatFooterBar.vue';
</script>

<style>
.chat_page_container {
  width: 1200px;
  height: 100vh;
  background-color: var(--im-theme-chatPageBg);
}
</style>

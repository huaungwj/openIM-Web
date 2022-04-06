<template>
  <!-- 当前聊天会话框 -->
  <div class="chat_page_container">
    <div v-if="cveStore.curCve">
      <!-- 头部用户信息栏 -->
      <ChatTopBar />
      <!-- 会话主体内容 -->
      <CharContent />
      <!-- 底部信息框 -->
      <CharFooterBar />
    </div>

    <Empty v-else :imgSrc="`/src/assets/images/empty1.png`">
      <template #header>
        <p class="title" style="font-size: 20px">快去聊天吧~</p>
        <p class="sub_title" style="padding-top: 10px">
          选择一个聊天窗口进行聊天吧~
        </p>
      </template>
    </Empty>
  </div>
</template>

<script lang="ts" setup>
import ChatTopBar from '@/views/Home/Cve/ChatPage/ChatTopBar.vue';
import CharContent from './ChatPage/CharContent.vue';
import CharFooterBar from '@/views/Home/Cve/ChatPage/ChatFooterBar.vue';
import Empty from '@/components/Empty/Empty.vue';
import { useCveStore } from '@/stores/cve';

const cveStore = useCveStore();
</script>

<style>
.chat_page_container {
  width: 1200px;
  height: 100vh;
  background-color: var(--im-theme-chatPageBg);
}
</style>

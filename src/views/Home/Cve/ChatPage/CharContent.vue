<template>
  <main class="chat_bg">
    <!-- 信息列表 -->
    <MsgItem
      v-for="msg in cveStore.historyMsgList"
      :key="msg.clientMsgID"
      :msg="msg"
    />
  </main>
</template>

<script lang="ts" setup>
import MsgItem from '@/views/Home/Cve/ChatPage/components/MsgItem.vue';
import { useCveStore } from '@/stores/cve';

const cveStore = useCveStore();
</script>

<style>
.chat_bg {
  padding: 51px 20px 210px 20px;
  background-color: var(--im-theme-chatPageBg);
  display: flex;
  flex-flow: column-reverse;
}
</style>

<template>
  <main class="chat_bg">
    <!-- 信息列表 -->

    <MsgItem
      v-for="msg in cveStore.historyMsgList"
      :key="msg.clientMsgID"
      :msg="msg"
    />

    <!-- 没有更多了 -->
    <div class="index_con_nomore__Hfico" v-if="!cveStore.hasMore">
      没有更多啦
    </div>
  </main>
</template>

<script lang="ts" setup>
import MsgItem from '@/views/Home/Cve/ChatPage/components/MsgItem.vue';
import { useCveStore } from '@/stores/cve';
import { tipsTypes } from '@/tools/im/constants/messageContentType';

const cveStore = useCveStore();

// console.log();
</script>

<style>
.chat_bg {
  padding: 90px 20px 230px 20px;
  background-color: var(--im-theme-chatPageBg);
  display: flex;
  flex-flow: column-reverse;
}
</style>

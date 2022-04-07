<template>
  <div class="msg_item">
    <!-- 头像 -->
    <MyAvatar :src="msg.senderFaceUrl" :size="40" />

    <!--  -->
    <SwitchMsgType :msg="msg" />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import MyAvatar from '@/components/myAvatar/MyAvatar.vue';
import type { MessageItem } from '@/tools/im/types';
import SwitchMsgType from './SwitchMsgType.vue';

const props = defineProps<{ msg: MessageItem }>();
</script>

<style>
/* 消息盒子 */
.msg_item {
  display: flex;
  margin: 10px 0;
}
</style>

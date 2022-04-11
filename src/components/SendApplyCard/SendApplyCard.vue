<template>
  <!-- 发送好友请求 -->
  <div>
    <div class="user_c_modal_header2 pointer" @click="changePageFun('default')">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#openIM-back"></use>
      </svg>
      <span>好友验证</span>
    </div>
    <!-- 卡片信息 -->
    <div class="user_c_modal_card_info user_c_modal_header_info">
      <div class="top_info">
        <div class="left_container">
          <span class="title">{{ name }}</span>
        </div>
        <!-- 右边盒子 -->
        <div class="right_container">
          <MyAvatar :src="avatarUrl" :size="62" />
        </div>
      </div>
      <!-- 验证信息框 -->
      <n-input
        v-model:value="sendVarMsg"
        type="text"
        placeholder="请输入验证信息"
      />

      <n-button class="add_f_btn" @click="sendFun(sendVarMsg)" type="primary"
        >发送</n-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref } from 'vue';
import MyAvatar from '@/components/myAvatar/MyAvatar.vue';

// 要发送的验证信息
const sendVarMsg = ref<string>('');

const props = defineProps<{
  name: string;
  sendFun: () => void;
  changePageFun: () => void;
  avatarUrl: string;
}>();
</script>

<style></style>

<template>
  <header class="chat_hearder_container">
    <div class="chat_header_left">
      <MyAvatar :size="42" src="ic_avatar_06" />
      <!-- 名称和在线状态等 -->
      <div class="cur_status">
        <!-- 用户昵称 -->
        <span class="cur_status_nick">小红</span>
        <div class="cur_status_update">
          <span class="icon"></span><span class="online">离线</span>
        </div>
      </div>
    </div>
    <!-- 右边电话、视频、设置 -->
    <div class="chat_header_right">
      <i class="iconfont openIM-phone"></i>
      <i class="iconfont openIM-video"></i>
      <i class="iconfont openIM-setting"></i>
    </div>
  </header>
</template>

<script lang="ts" setup>
import MyAvatar from '@/components/myAvatar/MyAvatar.vue';
</script>

<style>
/* 聊天头部用户信息栏 */
.chat_hearder_container {
  padding: 20px 0 5px 20px;
  width: 69%;
  display: flex;
  justify-content: space-between;
  background-color: var(--im-theme-chatPageBg);
  border-bottom: 1px solid var(--im-theme-chatPageSolid);
  position: fixed;
  z-index: 1;
}
.chat_hearder_container > .chat_header_left {
  display: flex;
  flex-direction: row;
}
.chat_header_left > .cur_status {
  padding-left: 15px;
  font-size: 12px;
}
.chat_header_left > .cur_status > .cur_status_nick {
  font-weight: 500;
  height: 24px;
  font-size: 16px;
}
/* icon 在线状态图标 */
.chat_header_left > .cur_status .icon {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #0ecc63;
}
/* text 在线状态文本 */
.chat_header_left > .cur_status .online {
  margin-left: 6px;
  margin-right: 12px;
}

/* 右部分 电话视频 */
.chat_hearder_container > .chat_header_right {
  margin-right: 30px;
}
.chat_hearder_container > .chat_header_right > .iconfont:hover {
  color: var(--im-theme-primary);
}
/* 所有图标 */
.chat_hearder_container > .chat_header_right > .iconfont {
  font-size: 23px;
  cursor: pointer;
}
/* 视频图标 */
.chat_hearder_container > .chat_header_right > .openIM-video {
  padding: 0 35px;
}
</style>

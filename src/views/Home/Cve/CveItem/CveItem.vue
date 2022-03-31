<template>
  <div class="cve_item">
    <div class="left">
      <MyAvatar src="ic_avatar_06" :size="40" />
      <div class="cve_info">
        <p class="info_title">小美</p>
        <p class="info_msg">你好啊</p>
      </div>
    </div>

    <p>昨天</p>
  </div>
</template>

<script lang="ts" setup>
import MyAvatar from '@/components/myAvatar/MyAvatar.vue';
</script>

<style lang="css">
.cve_item {
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 20px 15px 20px 20px;
  background-color: var(--im-theme-cveItemBg);
}
.cve_item > p {
  color: var(--color-text);
  font-size: 13px;
}

.cve_item > .left {
  display: flex;
}

.cve_item > .left > .cve_info {
  font-size: 12px;
  padding-left: 15px;
}
.cve_info > .info_title {
  font-size: 14px;
  font-weight: 500;
}
.cve_info > .info_msg {
  color: var(--color-text);
}
</style>

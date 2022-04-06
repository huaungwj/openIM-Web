<template>
  <div class="left_sider_container">
    <MyAvatar
      class="sider_avatar"
      :src="$isDark.value ? 'ic_avatar_06' : 'ic_avatar_01'"
      :size="36"
    />

    <ul class="sider_nav">
      <router-link to="/cve">
        <n-tooltip
          placement="right"
          :style="{ maxWidth: '400px' }"
          trigger="hover"
        >
          <template #trigger>
            <li>
              <n-badge :value="contactsStore.unReadCount" :max="99">
                <i
                  :class="`iconfont openIM-message2 ${
                    $route.path === '/cve' ? 'active' : ''
                  }`"
                ></i>
              </n-badge>
            </li>
          </template>
          消息
        </n-tooltip>
      </router-link>
      <router-link to="/contacts">
        <n-tooltip
          placement="right"
          :style="{ maxWidth: '400px' }"
          trigger="hover"
        >
          <template #trigger>
            <li>
              <i
                :class="`iconfont openIM-tongxunlu1 ${
                  $route.path === '/contacts' ? 'active' : ''
                }`"
              ></i>
            </li>
          </template>
          联系人
        </n-tooltip>
      </router-link>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import MyAvatar from '../myAvatar/MyAvatar.vue';
import { RouterLink } from 'vue-router';
import { useContactsStore } from '@/stores/contacts';

const contactsStore = useContactsStore();
</script>

<style>
.left_sider_container {
  text-align: center;
  height: 100vh;
  background-color: var(--im-theme-siderBg);
}
.left_sider_container > .sider_avatar {
  margin: 100px 0 30px 0;
}
.sider_nav {
  width: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.sider_nav li {
  width: 100%;
  list-style: none;
  height: 60px;
  line-height: 60px;
  cursor: pointer;
}
.sider_nav li i {
  font-size: 23px;
  color: var(--color-heading);
}

.sider_nav .active {
  color: #57be6a;
}
</style>

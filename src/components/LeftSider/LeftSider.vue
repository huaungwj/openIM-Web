<template>
  <div class="left_sider_container">
    <MyAvatar
      class="sider_avatar"
      :src="userStore.selfInfo.faceURL"
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
                <svg
                  :class="`icon ${
                    $route.path === '/cve' ? 'active' : 'default'
                  }`"
                  aria-hidden="true"
                >
                  <use :xlink:href="`#openIM-message`"></use>
                </svg>
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
              <n-badge :value="conCount" :max="99">
                <svg
                  :class="`icon ${
                    $route.path === '/contacts' ? 'active' : 'default'
                  }`"
                  aria-hidden="true"
                >
                  <use :xlink:href="`#openIM-tongxunlu1`"></use>
                </svg>
              </n-badge>
            </li>
          </template>
          联系人
        </n-tooltip>
      </router-link>
      <!-- 日历 -->
      <!-- 待办事项 -->
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import MyAvatar from '../myAvatar/MyAvatar.vue';
import { RouterLink } from 'vue-router';
import { useContactsStore } from '@/stores/contacts';
import { useUserStore } from '@/stores/user';
import type {
  FriendApplicationItem,
  GroupApplicationItem,
} from '@/tools/im/types';

const contactsStore = useContactsStore();
const userStore = useUserStore();
const conCount = ref<number>(0);

const initConCout = () => {
  let count = 0;
  contactsStore.recvFriendApplicationList.length > 0 &&
    contactsStore.recvFriendApplicationList.forEach(
      (item: FriendApplicationItem) => {
        if (item.handleResult === 0) count += 1;
      }
    );

  // 群组
  contactsStore.recvGroupApplicationList.length > 0 &&
    contactsStore.recvGroupApplicationList.forEach(
      (item: GroupApplicationItem) => {
        if (item.handleResult === 0) count += 1;
      }
    );
  conCount.value = count;
};
initConCout();

watch(
  [
    () => contactsStore.recvFriendApplicationList,
    () => contactsStore.recvGroupApplicationList,
  ],
  () => {
    initConCout();
  }
);
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
.sider_nav .default {
  color: var(--color-heading);
}
</style>

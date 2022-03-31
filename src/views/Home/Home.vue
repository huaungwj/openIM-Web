<template>
  <n-layout
    has-sider
    position="absolute"
    style="height: 100vh; background: 'none'"
  >
    <n-layout-sider
      style="backgournd: 'none'"
      :width="55"
      ref="siderRef"
      bordered
    >
      <left-sider />
    </n-layout-sider>
    <n-layout-content ref="contentRef" :native-scrollbar="false">
      <router-view />
    </n-layout-content>
    <n-layout-content ref="contentRef" :native-scrollbar="false">
      <router-view name="right" />
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { LayoutInst, LayoutSiderInst } from 'naive-ui';
import LeftSider from '@/components/LeftSider/LeftSider.vue';
import { im } from '@/tools';
import { useImLogin } from '@/hooks/useImLogin';

const token = localStorage.getItem(`improfile`)!;
const userID = localStorage.getItem('lastimuid')!;
const { imLogin } = useImLogin();
const siderRef = ref<LayoutSiderInst | null>(null);
const contentRef = ref<LayoutInst | null>(null);

console.log(token, userID);

if (token && userID) {
  im.getLoginStatus()
    .then((res) => {
      console.log('登录成功');
    })
    .catch((err) => {
      if (token && userID) {
        imLogin(userID, token);
      }
    });
}
</script>

<style></style>

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
import { ref, watch, onBeforeUnmount } from 'vue';
import type { LayoutInst, LayoutSiderInst } from 'naive-ui';
import LeftSider from '@/components/LeftSider/LeftSider.vue';
import { im, cveSort } from '@/tools';
import { useImLogin } from '@/hooks/useImLogin';
import { useCveStore } from '@/stores/cve';
import { useContactsStore } from '@/stores/contacts';
import { CbEvents } from '@/tools/im';
import type { ConversationItem, WsResponse } from '@/tools/im/types';

const token = localStorage.getItem(`improfile`)!;
const userID = localStorage.getItem('lastimuid')!;
const { imLogin } = useImLogin();
const siderRef = ref<LayoutSiderInst | null>(null);
const contentRef = ref<LayoutInst | null>(null);
const cveStore = useCveStore();
const contactsStore = useContactsStore();
// 是否登录
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

// 未读消息发生变化触发
im.on(CbEvents.ONTOTALUNREADMESSAGECOUNTCHANGED, (data) => {
  // dispatch(setUnReadCount(Number(data.data)));
  contactsStore.setUnReadCount(data.data);
});

// 有新的信息的时候触发
const conversationChnageHandler = (data: WsResponse) => {
  // console.log("ONCONVERSATIONCHANGED 发生改变了", data);
  let tmpCves = cveStore.cves;
  let filterArr: ConversationItem[] = [];
  const changes: ConversationItem[] = JSON.parse(data.data);
  const ms = JSON.parse(changes[0].latestMsg);
  console.log('conversationChnageHandler: ', ms);
  const chids = changes.map((ch) => ch.conversationID);
  filterArr = tmpCves.filter((tc) => !chids.includes(tc.conversationID));
  const idx = changes.findIndex(
    (c) => c.conversationID === cveStore.curCve?.conversationID
  );
  if (idx !== -1) cveStore.setCurCve(changes[idx]);
  const result = [...changes, ...filterArr];
  cveStore.setCveList(cveSort(result));
};

// 新的会话处理
const newConversationHandler = (data: WsResponse) => {
  console.log(JSON.parse(data.data));
  // console.log("ONCONVERSATIONCHANGED 新会话触发");
  let tmpCves = cveStore.cves;
  const news: ConversationItem[] = JSON.parse(data.data);
  const result = [...news, ...tmpCves];
  cveStore.setCveList(cveSort(result));
};

// 监听会话
watch([() => cveStore.curCve, () => cveStore.cves], (nCurCve, nCves) => {
  console.log('更新了');
  im.on(CbEvents.ONCONVERSATIONCHANGED, conversationChnageHandler);
  im.on(CbEvents.ONNEWCONVERSATION, newConversationHandler); // 有新的会话过来会触发
});

// 组件销毁
onBeforeUnmount(() => {
  im.off(CbEvents.ONCONVERSATIONCHANGED, conversationChnageHandler);
  im.off(CbEvents.ONNEWCONVERSATION, newConversationHandler);
});
</script>

<style></style>

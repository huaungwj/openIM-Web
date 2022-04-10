<template>
  <n-layout
    has-sider
    position="absolute"
    style="height: 100vh; background: 'none'"
  >
    <n-layout-sider
      style="backgournd: 'none'"
      :width="60"
      ref="siderRef"
      bordered
    >
      <left-sider />
    </n-layout-sider>
    <n-layout-content :native-scrollbar="false">
      <router-view />
    </n-layout-content>

    <n-layout-content
      ref="cveContentRef"
      :native-scrollbar="false"
      :on-scroll="scrollChange"
    >
      <router-view name="right" :native-scrollbar="false" />
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, onMounted, nextTick } from 'vue';
import type { LayoutInst, LayoutSiderInst } from 'naive-ui';
import LeftSider from '@/components/LeftSider/LeftSider.vue';
import { im, cveSort } from '@/tools';
import { throttle } from '@/tools/tools';
import { useImLogin } from '@/hooks/useImLogin';
import { useCveStore } from '@/stores/cve';
import { useContactsStore } from '@/stores/contacts';
import { CbEvents } from '@/tools/im';
import type { ConversationItem, WsResponse } from '@/tools/im/types';
import { useRoute } from 'vue-router';

const token = localStorage.getItem(`improfile`)!;
const userID = localStorage.getItem('lastimuid')!;
const { imLogin } = useImLogin();
const siderRef = ref<LayoutSiderInst | null>(null);
const cveContentRef = ref<LayoutInst | null>(null);
const cveStore = useCveStore();
const contactsStore = useContactsStore();
const route = useRoute();
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

// 滚动
const scrollChange = throttle(
  (e: Event) => {
    console.log(cveStore.cveContentRef.scrollTop);
    if (cveStore.cveCScHeight !== cveStore.cveContentRef.scrollHeight) {
      cveStore.setCveCScHeiht(cveStore.cveContentRef.scrollHeight);
    }
    // 获取更多历史信息
    if (
      cveStore.cveContentRef.scrollTop < 100 &&
      cveStore.hasMore &&
      route.path === '/cve'
    ) {
      // 到顶
      const config = {
        userID: cveStore.curCve.userID ?? '',
        groupID: cveStore.curCve.groupID ?? '',
        count: 20,
        startClientMsgID:
          cveStore.historyMsgList[cveStore.historyMsgList.length - 1]
            .clientMsgID,
      };
      cveStore.getMsg(config);
    }
  },
  500,
  2
);

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
  // 最近一条消息
  const ms = JSON.parse(changes[0].latestMsg);
  console.log('conversationChnageHandler: ', ms);
  const chids = changes.map((ch) => ch.conversationID);
  filterArr = tmpCves.filter((tc) => !chids.includes(tc.conversationID));
  // 查找当前会话的信息 进行替换
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

im.on(CbEvents.ONCONVERSATIONCHANGED, conversationChnageHandler);
im.on(CbEvents.ONNEWCONVERSATION, newConversationHandler);

// // 监听会话
// watch([() => cveStore.curCve, () => cveStore.cves], () => {
//   console.log('更新了');
//   // 有新的会话过来会触发
// });

onMounted(() => {
  nextTick(() => {
    cveStore.setCveContentRef(
      cveContentRef.value?.$el?.children[0].childNodes[0]
    );
  });
});

// 组件销毁
onBeforeUnmount(() => {
  console.log('销毁了， conversationChnageHandler');
  im.off(CbEvents.ONCONVERSATIONCHANGED, conversationChnageHandler);
  im.off(CbEvents.ONNEWCONVERSATION, newConversationHandler);
});

window.urlClick = (url: string) => {
  if (url.indexOf('http') === -1 && url.indexOf('https') === -1) {
    url = `http://${url}`;
  }
  window.open(url, '_blank');
};
</script>

<style></style>

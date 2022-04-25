<template>
  <div class="contact_r_c">
    <ContactTopBar />
    <!-- 常用联系人 和 我的好友 -->
    <main class="contact_main">
      <TCAMF
        v-if="contactsStore.conPage === 'tC' || contactsStore.conPage === 'mF'"
        :goChatFun="goChatFun"
      />
      <!-- 新的好友 和 新的群组 -->
      <NewFG
        v-if="contactsStore.conPage === 'nF' || contactsStore.conPage === 'nG'"
        :goChatFun="goChatFun"
      />
      <!-- 我的群组 -->
      <MG v-if="contactsStore.conPage === 'mG'" :goChatFun="goChatFun" />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { useContactsStore } from '@/stores/contacts';
import NewFG from '@/views/Home/Contact/contactRight/NewFG.vue';
import TCAMF from '@/views/Home/Contact/contactRight/TCAMF.vue';
import MG from '@/views/Home/Contact/contactRight/MG.vue';
import ContactTopBar from '@/views/Home/Contact/contactRight/components/ContactTopBar.vue';
import { useMessage } from 'naive-ui';
import { im, isSingleCve } from '@/tools';
import type { ConversationItem } from '@/tools/im/types';
import { useOpenCveWindow } from '@/hooks/useOpenCveWindow';
import { useCveStore } from '@/stores/cve';
import type { SessionType } from '@/tools/im/constants/messageContentType';
import { useRouter } from 'vue-router';

const contactsStore = useContactsStore();
const cveStore = useCveStore();
const { openCveWindow } = useOpenCveWindow();
const message = useMessage();
const router = useRouter();
// 去聊天页面
const goChatFun = async (id: string, type: SessionType) => {
  // 检查好友关系是否正常
  const checkResult = await im.checkFriend([id ?? cveStore.curCve.userID]);
  console.log(JSON.parse(checkResult.data));
  if (JSON.parse(checkResult.data)[0].result !== 1)
    return message.error('你和对方不是好友，无法发送消息');

  getOneCve(id, type)
    .then((cve) => openCveWindow(cve))
    .catch((err) => message.error('找不到会话！'));
  router.push('/');
};

// 获取会话列表
const getOneCve = (
  sourceID: string,
  sessionType: number
): Promise<ConversationItem> => {
  return new Promise((resolve, reject) => {
    im.getOneConversation({ sourceID, sessionType })
      .then((res) => resolve(JSON.parse(res.data)))
      .catch((err) => reject(err));
  });
};
</script>

<style>
.contact_r_c {
  width: 70vw;
}

.contact_r_c > .contact_main {
  padding: 90px 20px 50px 20px;
}
</style>

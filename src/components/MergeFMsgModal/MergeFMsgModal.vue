<template>
  <div class="merge_f_m_modal_c">
    <n-modal
      v-model:show="mergeModalShow"
      class="custom-card"
      preset="card"
      :style="bodyStyle"
      title="聊天记录"
      size="huge"
      :bordered="false"
    >
      <!-- <template #header-extra> </template> -->
      <n-scrollbar style="max-height: 350px">
        <div class="merge_modal_container">
          <MsgItem
            v-for="msg in mutilMsgArr"
            :key="msg.clientMsgID"
            :msg="msg"
          />
        </div>
      </n-scrollbar>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeMount, ref } from 'vue';
import MsgItem from '@/views/Home/Cve/ChatPage/components/MsgItem.vue';
import Bus from '@/tools/bus';
import type { MessageItem } from '@/tools/im/types';

const mergeModalShow = ref<boolean>(false);
const bodyStyle = { width: '600px', maxHeight: '500px' };
const mutilMsgArr = ref<MessageItem[]>();

onMounted(() => {
  Bus.$on(
    'PREVIEWMERGEMSG',
    ({
      type,
      mutilMsgArrTmp,
    }: {
      type: boolean;
      mutilMsgArrTmp: MessageItem[];
    }) => {
      console.log(mutilMsgArrTmp);
      mergeModalShow.value = type;
      mutilMsgArr.value = mutilMsgArrTmp;
    }
  );
});
</script>

<style>
.merge_modal_container {
  background: var(--im-theme-topSearchBg);
  padding: 20px 0 10px 20px;
}
</style>

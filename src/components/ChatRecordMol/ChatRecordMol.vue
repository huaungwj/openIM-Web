<template>
  <!-- :title="$t('chatRecord')" -->
  <n-modal
    v-model:show="chatRecordIsShow"
    class="custom-card"
    preset="card"
    :style="bodyStyle"
    size="huge"
    :bordered="false"
  >
    <template #header>
      <header class="chat_r_m_header">
        <MyAvatar :src="cveStore.curCve.faceURL" :size="50" />
        <p>
          <span class="nickname">{{ cveStore.curCve.showName }}</span>
          <span class="peopel_number" v-if="!isSingleCve(cveStore.curCve)"
            >（{{ contactsStore.groupInfo.memberCount }}）</span
          >
        </p>
      </header>
    </template>

    <div class="chat_r_m_container">
      <!-- start  -->
      <div class="search_input_container">
        <n-input
          :placeholder="$t('search')"
          size="small"
          v-model:value="searchInputValue"
          @keydown.enter="filterMsg"
        >
          <template #prefix>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#openIM-search"></use>
            </svg>
          </template>
        </n-input>
      </div>
      <!-- end  -->
      <div class="search_c_r_tabs">
        <li
          :class="`search_c_r_tab ${curTabStatus === 'all' && 'tab_active'}`"
          @click="toggleTab('all')"
        >
          全部
        </li>
        <li
          :class="`search_c_r_tab ${curTabStatus === 'file' && 'tab_active'}`"
          @click="toggleTab('file')"
        >
          文件
        </li>
        <li
          :class="`search_c_r_tab ${
            curTabStatus === 'imgAVideo' && 'tab_active'
          }`"
          @click="toggleTab('imgAVideo')"
        >
          图片与视频
        </li>
      </div>
      <!-- end -->
      <div class="search_c_r_msg_c" v-if="chatRecordList?.length > 0">
        <n-scrollbar
          style="max-height: 400px"
          :on-scroll="scrollChange"
          ref="searchScrollRef"
        >
          <div class="search_msg_container" ref="searchContainerRef">
            <MsgItem
              v-for="msg in chatRecordList"
              :key="msg.clientMsgID"
              :msg="msg"
            />
            <span v-if="!cveStore.hasMore" style="text-align: center"
              >没有更多啦~</span
            >
          </div>
        </n-scrollbar>
      </div>
      <div
        class="chat_r_m_container"
        style="min-height: 400px; text-align: center"
        v-else
      >
        暂无数据
      </div>
    </div>
  </n-modal>
</template>

<script lang="ts" setup>
import { onMounted, ref, nextTick, watch } from 'vue';
import MyAvatar from '../myAvatar/MyAvatar.vue';
import Bus from '@/tools/bus';
import { useCveStore } from '@/stores/cve';
import { useContactsStore } from '@/stores/contacts';
import MsgItem from '@/views/Home/Cve/ChatPage/components/MsgItem.vue';
import { isSingleCve } from '@/tools';
import { throttle } from '@/tools/tools';
import type { MessageItem } from '@/tools/im/types';
import { messageTypes } from '@/tools/im/constants/messageContentType';

const cveStore = useCveStore();
const contactsStore = useContactsStore();
const bodyStyle = { width: '600px', maxHeight: '600px' };
const chatRecordIsShow = ref<boolean>(false);
const searchInputValue = ref<string>('');
const curTabStatus = ref<string>('all');
const chatRecordList = ref<MessageItem[]>();
const searchContainerRef = ref<Element | null>(null);
const searchScrollRef = ref<Element | null>(null);

const toggleTab = (status: string) => {
  if (curTabStatus.value === status) return;
  curTabStatus.value = status;
};

const filterMsg = () => {
  let tmp;
  switch (curTabStatus.value) {
    case 'all': {
      tmp = cveStore.historyMsgList.filter((msg: MessageItem) => {
        return searchInputValue.value.trim()
          ? msg.content.toLowerCase().indexOf(searchInputValue.value) >= 0 &&
              msg.contentType === messageTypes.TEXTMESSAGE
          : msg;
      });
      break;
    }
    case 'file': {
      tmp = cveStore.historyMsgList.filter((msg: MessageItem) => {
        return (
          msg.fileElem.fileName.toLowerCase().indexOf(searchInputValue.value) >=
            0 && msg.contentType === messageTypes.FILEMESSAGE
        );
      });
      break;
    }
    case 'imgAVideo': {
      tmp = cveStore.historyMsgList.filter((msg: MessageItem) => {
        return (
          msg.contentType === messageTypes.PICTUREMESSAGE ||
          msg.contentType === messageTypes.VIDEOMESSAGE
        );
      });
      break;
    }
  }

  chatRecordList.value = tmp;

  // control scroll
  if (cveStore.isPullMore && searchContainerRef.value?.scrollHeight) {
    // console.log(searchScrollRef.value?.scrollbarInstRef.containerRef.scrollTop);
    return nextTick(() => {
      searchScrollRef.value?.scrollTo({
        top:
          searchScrollRef.value?.scrollbarInstRef.containerRef.scrollTop + 90,
      });
    });
  }

  nextTick(() => {
    searchScrollRef.value?.scrollTo({
      top: searchContainerRef.value?.scrollHeight,
    });
  });
};

const scrollChange = throttle(
  () => {
    const scrollTop =
      searchScrollRef.value?.scrollbarInstRef.containerRef.scrollTop;
    // console.log(scrollTop);
    if (
      scrollTop < 500 &&
      cveStore.hasMore &&
      cveStore.historyMsgList.length > 0
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
  200,
  2
);

watch(
  () => cveStore.historyMsgList,
  () => {
    if (!chatRecordIsShow.value) return;
    filterMsg();
  }
);

watch(
  () => curTabStatus.value,
  () => {
    // console.log('执行了啊', curTabStatus.value);
    filterMsg();
  }
);

onMounted(() => {
  Bus.$on('SHOWCHATRECORDMOL', (status: boolean) => {
    chatRecordIsShow.value = status;
    filterMsg();
  });
});
</script>

<style>
.chat_r_m_header {
  display: flex;
  align-items: center;
}

.chat_r_m_header > p {
  padding-left: 10px;
  font-size: 14px;
}

.chat_r_m_container > .search_c_r_tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}
.chat_r_m_container > .search_c_r_tabs > .search_c_r_tab {
  cursor: pointer;
}

.chat_r_m_container > .search_c_r_msg_c {
  height: 500px;
}
.chat_r_m_container > .search_c_r_msg_c .search_msg_container {
  display: flex;
  flex-direction: column;
  flex-flow: column-reverse;
}

.msg_container {
  background: var(--im-theme-topSearchBg);
  padding: 20px 0 10px 20px;
}

/* active */
.chat_r_m_container .tab_active {
  color: var(--im-theme-primary);
}
</style>

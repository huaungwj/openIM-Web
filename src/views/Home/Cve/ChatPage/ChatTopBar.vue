<template>
  <header class="chat_hearder_container">
    <div class="chat_header_left">
      <MyAvatar :size="42" :src="cveStore.curCve.faceURL" />
      <!-- 名称和在线状态等 -->
      <div class="cur_status">
        <!-- 用户昵称 -->
        <span class="cur_status_nick">{{ cveStore.curCve.showName }}</span>
        <div class="cur_status_update" v-if="isSingleCve(cveStore.curCve)">
          <span
            class="icon"
            :style="{
              backgroundColor:
                onlineStatus === '离线' ? 'rgb(149 149 149)' : '',
            }"
          ></span
          ><span class="online">{{ onlineStatus }}</span>
        </div>

        <div v-else class="group_container">
          <div className="num">
            <svg class="im-icon" aria-hidden="true">
              <use xlink:href="#openIM-people3geren"></use>
            </svg>
            <span>{{ contactsStore.groupInfo.memberCount }}</span>
          </div>
          <div className="num">
            <span className="icon" />
            <span className="online">{{ onlineNo }} 人在线</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 右边电话、视频、设置 -->
    <div class="chat_header_right">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#openIM-phone"></use>
      </svg>
      <svg class="icon openIM-video" aria-hidden="true">
        <use xlink:href="#openIM-video"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#openIM-setting"></use>
      </svg>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import MyAvatar from '@/components/myAvatar/MyAvatar.vue';
import { useCveStore } from '@/stores/cve';
import { useContactsStore } from '@/stores/contacts';
import { useUserStore } from '@/stores/user';
import { isSingleCve } from '@/tools';
import type { ConversationItem, DetailType } from '@/tools/im/types';
import { getOnline } from '@/service/cve/cve';

const cveStore = useCveStore();
const contactsStore = useContactsStore();
const userStore = useUserStore();
// 上一个会话
const lastCve = ref<ConversationItem>();
// 群组在线的数量
const onlineNo = ref<number>(0);
// 单会话在线状态
const onlineStatus = ref<string>('离线');

// 获取群组的在线数量
const getGroupOnline = () => {
  console.log(contactsStore.groupMemberList);
  const tmplist = [...contactsStore.groupMemberList];
  const total = Math.ceil(tmplist.length / 200);
  let promiseArr = [];
  for (let i = 0; i < total; i++) {
    promiseArr.push(
      getOnline(
        tmplist.splice(0, 200).map((m) => m.userID),
        userStore.adminToken
      )
    );
  }

  Promise.all(promiseArr).then((res) => {
    let count = 0;
    let obj = {};
    res.map((pres) => {
      pres?.data?.map((item) => {
        obj = { ...obj, [item.userID]: item };
        if (item.status === 'online') {
          count += 1;
        }
      });
    });

    onlineNo.value = count;
  });
};

const initInfo = () => {
  if (
    (cveStore.curCve.conversationID == lastCve.value?.conversationID &&
      cveStore.curCve?.faceURL === lastCve.value?.faceURL &&
      cveStore.curCve?.showName === lastCve.value?.showName) ||
    contactsStore.groupMemberLoading
  )
    return;

  lastCve.value = cveStore.curCve;
  if (isSingleCve(cveStore.curCve)) {
    getOnline([cveStore.curCve.userID], userStore.adminToken).then((res) => {
      const statusItem = res.data[0];
      if (statusItem.userID === cveStore.curCve.userID) {
        switchOnline(statusItem.status, statusItem.detailPlatformStatus);
      }
    });
  } else if (
    !isSingleCve(cveStore.curCve) &&
    !contactsStore.groupMemberLoading &&
    contactsStore.groupMemberList.length > 0
  ) {
    getGroupOnline();
  }
};

onMounted(() => {
  initInfo();
});

watch(
  [
    () => cveStore.curCve,
    () => contactsStore.groupMemberList,
    () => contactsStore.groupMemberLoading,
    () => lastCve.value,
  ],
  () => {
    initInfo();
  }
);

const switchOnline = (oType: string, details?: DetailType[]) => {
  switch (oType) {
    case 'offline':
      onlineStatus.value = '离线';
      break;
    case 'online':
      let str: string = '';
      details?.map((detail) => {
        if (detail.status === 'online') {
          str += `${detail.platform}/`;
        }
      });
      onlineStatus.value = `${str.slice(0, -1)} 在线`;
      break;
    default:
      break;
  }
};
</script>

<style>
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

.chat_header_left > .cur_status > .group_container {
  display: flex;
  align-items: center;
}
.chat_header_left > .cur_status > .group_container > .num {
  padding-right: 10px;
}
.chat_header_left > .cur_status > .group_container .iconfont {
  padding-right: 5px;
}

/* 右部分 电话视频 */
.chat_hearder_container > .chat_header_right {
  margin-right: 30px;
}
.chat_hearder_container > .chat_header_right > .icon:hover {
  color: var(--im-theme-primary);
}
/* 所有图标 */
.chat_hearder_container > .chat_header_right > .icon {
  cursor: pointer;
}
/* 视频图标 */
.chat_hearder_container > .chat_header_right > .openIM-video {
  margin: 0 35px;
}
</style>

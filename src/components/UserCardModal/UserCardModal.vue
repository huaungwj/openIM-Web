<template>
  <n-modal
    v-model:show="cveStore.friendCardIsShow"
    transform-origin="center"
    :style="bodyStyle"
  >
    <n-card
      content-style="padding: 0;"
      style="width: 280px"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <!-- 用户展示 -->
      <div v-if="cardTypeStatus === 'default'">
        <div class="user_c_modal_header">
          <div class="user_c_modal_header_info">
            <!-- 左边盒子 -->
            <div class="left_container">
              <span class="title">{{ friendData?.nickname }}</span>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#openIM-zhanghu"></use>
              </svg>
            </div>
            <!-- 右边盒子 -->
            <div class="right_container">
              <MyAvatar src="ic_avatar_06" :size="62" />
            </div>
          </div>
        </div>
        <!-- 下面内容盒子 -->
        <div class="user_c_modal_cotainer">
          <p class="title">用户信息</p>
          <ul class="user_info_list">
            <li class="user_info_item name">
              <span class="label">昵称：</span>
              <span class="label_value">{{ friendData?.nickname }}</span>
            </li>
            <li class="user_info_item name">
              <span class="label">性别：</span>
              <span class="label_value">男</span>
            </li>
            <li class="user_info_item name">
              <span class="label">ID：</span>
              <span class="label_value">{{ friendData?.userID }}</span>
            </li>
          </ul>
          <n-button class="add_f_btn" @click="sendAddOrSendM" type="primary">{{
            isFriend ? '发送信息' : '添加好友'
          }}</n-button>
        </div>
      </div>
      <!-- 发送好友申请 -->
      <SendApplyCard
        v-else
        :name="friendData.nickname"
        :avatarUrl="friendData.faceURL"
        :send-fun="sendAddFriendFun"
        :change-page-fun="changeCardTypeStatusFun"
      />
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { defineProps, ref, watch, onBeforeUnmount, onMounted } from 'vue';
import SendApplyCard from '../SendApplyCard/SendApplyCard.vue';
import MyAvatar from '@/components/myAvatar/MyAvatar.vue';
import { useMessage } from 'naive-ui';
import { im } from '@/tools';
import type {
  AddFriendParams,
  FriendItem,
  ConversationItem,
  PublicUserItem,
} from '@/tools/im/types';
import { useContactsStore } from '@/stores/contacts';
import { useCveStore } from '@/stores/cve';
import { useOpenCveWindow } from '@/hooks/useOpenCveWindow';
import { SessionType } from '../../tools/im/constants/messageContentType';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps<{
  changeUserCardStatus: (type: boolean) => void;
  changeQuModal?: (type: boolean) => void;
  setInputLoading?: (type: boolean) => void;
  clearModalData?: () => void;
}>();

const { openCveWindow } = useOpenCveWindow();
const message = useMessage();
const route = useRoute();
const router = useRouter();
// 模态框样式
const bodyStyle = { width: '300px' };
// type 页面
const cardTypeStatus = ref<string>('default');
// contactsStore
const contactsStore = useContactsStore();
// cveStore
const cveStore = useCveStore();
// 朋友数据
const friendData = ref<PublicUserItem | FriendItem>();

// 是否是朋友
const isFriend = ref<boolean>(false);

// 发送好友请求
const sendAddFriendFun = (msg: string) => {
  const param: AddFriendParams = {
    toUserID: friendData.value.userID,
    reqMsg: msg,
  };

  im.addFriend(param)
    .then((res) => {
      console.log(res);
      message.success('发送成功');
      props.changeUserCardStatus(false);
      cardTypeStatus.value = 'default';
    })
    .catch((err) => {
      message.error('添加失败');
    });
};

// 改变 cardTypeStatus 的状态
const changeCardTypeStatusFun = (type: string) => {
  cardTypeStatus.value = type;
};

// 发送消息还是发送好友请求
const sendAddOrSendM = () => {
  if (!isFriend.value) return (cardTypeStatus.value = 'send');
  // 发送信息
  getOneCve(friendData.value?.userID, SessionType.SINGLECVE)
    .then((cve) => openCveWindow(cve))
    .catch((err) => message.error('找不到会话！'));
  // router.push('/');
  props.changeUserCardStatus(false);
  props.changeQuModal(false);
  if (route.path !== '/cve') return router.push('/cve');
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

const initData = () => {
  // 1. 根据 朋友ID 搜索
  im.getUsersInfo([cveStore.friendIDCard])
    .then((res) => {
      props.changeUserCardStatus(true);
      let tmpArr = JSON.parse(res.data);
      if (tmpArr.length > 0) {
        friendData.value = tmpArr[0].friendInfo
          ? tmpArr[0].friendInfo
          : tmpArr[0].publicInfo;
      } else {
        message.info('用户搜索结果为空');
      }
    })
    .catch((err) => {
      console.log(err);
    });
  props?.setInputLoading(false);
  props.clearModalData();
};

watch(
  [
    () => contactsStore.friendList,
    () => cveStore.friendCardIsShow,
    () => friendData.value,
  ],
  () => {
    if (friendData.value?.remark !== undefined) {
      isFriend.value = true;
      return;
    }

    // 没有好友信息返回会走到这里
    const idx = contactsStore.friendList.findIndex(
      (f) => f.userID == friendData.value?.userID
    );

    if (idx > -1) {
      isFriend.value = true;
    } else {
      isFriend.value = false;
    }
  }
);

watch(
  () => cveStore.friendIDCard,
  () => {
    if (!cveStore.friendIDCard) return;
    initData();
  }
);
</script>

<style>
/* 头部盒子 */
.user_c_modal_header_info,
.user_c_modal_card_info > .top_info {
  padding: 30px 40px 0 40px;
  display: flex;
  justify-content: space-between;
}
/* 头部左边 */
.user_c_modal_header_info .left_container {
  display: flex;
  flex-direction: column;
}
/* 内容用户信息部分 */
.user_c_modal_cotainer {
  margin-top: 20px;
  padding: 0 40px;
  /* height: 220px; */
  background-color: var(--im-theme-cveItemBg);
}
.user_c_modal_cotainer > .title {
  font-size: 14px;
  font-weight: 600;
  padding-top: 20px;
}
/* 名字、id 信息列表 */
.user_c_modal_cotainer > .user_info_list {
  margin-top: 20px;
  padding: 0;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
/* 发送和添加好友按钮 */
.add_f_btn {
  margin: 20px 0;
  width: 100%;
}

/* 用户信息 -- 验证 */
.user_c_modal_card_info {
  flex-direction: column;
  background-color: var(--im-theme-cveItemBg);
}

/* 用户信息 --- 验证 */
.user_c_modal_card_info > .top_info {
  align-items: center;
  padding: 10px;
}
/* 头部返回按钮 */
.user_c_modal_header2 {
  padding: 15px 0 15px 20px;
}
</style>

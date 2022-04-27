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
              <span
                class="title"
                style="
                  width: 120px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
                >{{ friendData?.nickname }}</span
              >
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#openIM-zhanghu"></use>
              </svg>
            </div>
            <!-- 右边盒子 -->
            <div class="right_container">
              <UplaodAvatar
                :is-edit="friendData?.userID !== userStore.selfInfo.userID"
                :getUplaodURL="getUplaodURL"
                :faceURL="friendData?.faceURL ?? ''"
              />
            </div>
          </div>
        </div>
        <!-- 下面内容盒子 -->
        <div class="user_c_modal_cotainer">
          <p class="title">{{ t('userInfo') }}</p>
          <ul class="user_info_list">
            <!-- 昵称 -->
            <li class="user_info_item name">
              <span class="label">{{ t('nickname') }}：</span>
              <span v-show="!editInfo.nickname.isEdit">
                <span class="label_value">{{ friendData?.nickname }}</span>
                <svg
                  @click="clickEdit(EditUserPrototy.nickname)"
                  class="icon"
                  v-if="friendData?.userID === userStore.selfInfo.userID"
                  style="cursor: pointer"
                  aria-hidden="true"
                >
                  <use xlink:href="#openIM-bianji"></use>
                </svg>
              </span>
              <n-input
                v-show="editInfo.nickname.isEdit"
                v-model:value="editInfo.nickname.value"
                type="text"
                size="small"
                style="width: 130px"
                :placeholder="t('pleaseEnter') + t('nickname')"
                @blur="changeUserInfo(EditUserPrototy.nickname)"
                @keydown.enter="changeUserInfo(EditUserPrototy.nickname)"
              />
            </li>
            <!-- 性别 -->
            <li class="user_info_item name">
              <span class="label">{{ t('nickname') }}：</span>
              <span v-show="!editInfo.gender.isEdit">
                <span class="label_value">{{
                  friendData?.gender === 1 ?? $t('male')
                    ? $t('male')
                    : $t('female')
                }}</span>
                <svg
                  @click="clickEdit(EditUserPrototy.gender)"
                  class="icon"
                  v-if="friendData?.userID === userStore.selfInfo.userID"
                  style="cursor: pointer"
                  aria-hidden="true"
                >
                  <use xlink:href="#openIM-bianji"></use>
                </svg>
              </span>
              <n-input
                v-show="editInfo.gender.isEdit"
                v-model:value="editInfo.gender.value"
                type="text"
                size="small"
                style="width: 130px"
                @blur="changeUserInfo(EditUserPrototy.gender)"
                :placeholder="t('pleaseEnter') + t('gender')"
                @keydown.enter="changeUserInfo(EditUserPrototy.gender)"
              />
            </li>
            <!-- id -->
            <li class="user_info_item name">
              <span class="label">ID：</span>
              <span class="label_value">{{ friendData?.userID }}</span>
            </li>
            <!-- 电话号码 -->
            <li
              class="user_info_item name"
              v-if="friendData?.userID === userStore.selfInfo.userID"
            >
              <span class="label">{{ $t('phoneNumber') }}：</span>
              <span v-show="!editInfo.phoneNumber.isEdit">
                <span
                  class="label_value"
                  v-show="!editInfo.phoneNumber.isEdit"
                  >{{ friendData?.phoneNumber }}</span
                >
                <svg
                  @click="clickEdit(EditUserPrototy.phoneNumber)"
                  class="icon"
                  v-if="friendData?.userID === userStore.selfInfo.userID"
                  style="cursor: pointer"
                  aria-hidden="true"
                >
                  <use xlink:href="#openIM-bianji"></use>
                </svg>
              </span>
              <n-input
                v-show="editInfo.phoneNumber.isEdit"
                v-model:value="editInfo.phoneNumber.value"
                type="text"
                @blur="changeUserInfo(EditUserPrototy.phoneNumber)"
                size="small"
                style="width: 130px"
                :placeholder="t('pleaseEnter') + t('phoneNumber')"
                @keydown.enter="changeUserInfo(EditUserPrototy.phoneNumber)"
              />
            </li>
          </ul>
          <n-button
            v-if="friendData?.userID !== userStore.selfInfo.userID"
            class="add_f_btn"
            @click="sendAddOrSendM"
            type="primary"
            >{{ isFriend ? t('sendMsg') : t('addFriend') }}</n-button
          >
          <n-button
            v-else
            class="add_f_btn"
            @click="saveUserInfo"
            type="primary"
            >{{ t('save') }}</n-button
          >
        </div>
      </div>
      <!-- 发送好友申请 -->
      <SendApplyCard
        v-else
        :name="friendData!.nickname"
        :avatarUrl="friendData!.faceURL"
        :send-fun="sendAddFriendFun"
        :change-page-fun="changeCardTypeStatusFun"
      />
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { defineProps, ref, watch, reactive } from 'vue';
import SendApplyCard from '../SendApplyCard/SendApplyCard.vue';
import UplaodAvatar from '@/components/UploadAvatar/UploadAvatar.vue';
import { useMessage } from 'naive-ui';
import { im } from '@/tools';
import type {
  AddFriendParams,
  FriendItem,
  ConversationItem,
  PublicUserItem,
  BlackItem,
} from '@/tools/im/types';
import { useContactsStore } from '@/stores/contacts';
import { useCveStore } from '@/stores/cve';
import { useUserStore } from '@/stores/user';
import { useOpenCveWindow } from '@/hooks/useOpenCveWindow';
import { useI18n } from 'vue-i18n';
import { SessionType } from '../../tools/im/constants/messageContentType';
import { useRoute, useRouter } from 'vue-router';

type EditType = {
  value: string | number;
  isEdit: boolean;
};
enum EditUserPrototy {
  nickname = 'nickname',
  gender = 'gender',
  phoneNumber = 'phoneNumber',
}

type EditUserInfo = {
  [EditUserPrototy.nickname]: EditType;
  [EditUserPrototy.gender]: EditType;
  [EditUserPrototy.phoneNumber]: EditType;
};

const props = defineProps<{
  changeUserCardStatus: (type: boolean) => void;
  changeQuModal?: (type: boolean) => void;
  setInputLoading?: (type: boolean) => void;
  clearModalData?: (type: any) => void;
}>();

const { openCveWindow } = useOpenCveWindow();
const message = useMessage();
const route = useRoute();
const { t } = useI18n();
const router = useRouter();
// 模态框样式
const bodyStyle = { width: '300px' };
//  页面状态
const cardTypeStatus = ref<string>('default');
const contactsStore = useContactsStore();
const cveStore = useCveStore();
const userStore = useUserStore();
const friendData = ref<PublicUserItem & FriendItem>();
const isFriend = ref<boolean>(false);
const editInfo = reactive<EditUserInfo>({
  [EditUserPrototy.nickname]: { value: '', isEdit: false },
  [EditUserPrototy.gender]: { value: '', isEdit: false },
  [EditUserPrototy.phoneNumber]: { value: '', isEdit: false },
});

// 发送好友请求
const sendAddFriendFun = (msg: string) => {
  const param: AddFriendParams = {
    toUserID: friendData.value!.userID,
    reqMsg: msg,
  };
  // 判断是否在黑名单中，如果是，则移出黑名单
  if (
    contactsStore.blackList.some(
      (item: BlackItem) => item.userID === friendData.value!.userID
    )
  ) {
    im.removeBlack(friendData.value!.userID);
  }
  im.addFriend(param)
    .then((res) => {
      console.log(res);
      message.success(t('sendSuc'));
      props.changeUserCardStatus(false);
      cardTypeStatus.value = 'default';
    })
    .catch((err) => {
      message.error(t('sendFail'));
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
  getOneCve(friendData.value!.userID, SessionType.SINGLECVE)
    .then((cve) => openCveWindow(cve))
    .catch((err) => message.error(t('notFind') + t('conversation') + '!'));
  // router.push('/');
  props.changeUserCardStatus(false);
  props.changeQuModal!(false);
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
        message.info(t('userSearchEmpty'));
      }
    })
    .catch((err) => {
      console.log(err);
    });
  props.setInputLoading(false);
  props.clearModalData();
};

// 获取上传后的图片地址
const getUplaodURL = (url: string) => {
  const cTmp = { ...friendData.value };
  cTmp.faceURL = url;
  friendData.value = cTmp;
};

const saveUserInfo = () => {
  const selfInfo: any = friendData.value;
  im.setSelfInfo(selfInfo)
    .then((res) => {
      message.success(t('saveSuc'));
      userStore.getSelfInfo();
    })
    .catch((err) => message.error(t('actionErrorText')));
};

const clickEdit = (type: EditUserPrototy) => {
  editInfo[type].isEdit = true;
  if (type === EditUserPrototy.gender) {
    return (editInfo[type].value = friendData.value![type] === 1 ? '男' : '女');
  }
  editInfo[type].value = friendData.value![type];

  console.log(editInfo[type], friendData);
};

const changeUserInfo = (type: EditUserPrototy) => {
  let value = editInfo[type].value;
  if (type === EditUserPrototy.gender) {
    if (!['男', '女'].includes(value.toString()))
      return message.warning(t('verifyGenderFail'));

    value === '男' ? (value = 1) : (value = 2);
  } else if (
    type === EditUserPrototy.phoneNumber &&
    !/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(value)
  ) {
    return message.warning(t('login.contentRight.phoneVerText2'));
  }
  friendData.value![type] = value;
  editInfo[type].isEdit = false;
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
  () => cveStore.friendCardIsShow,
  () => {
    if (!cveStore.friendCardIsShow) return;
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
  align-items: center;
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
  padding-bottom: 20px;
  /* height: 220px; */
  background-color: var(--im-theme-cveItemBg);
}
.user_c_modal_cotainer .user_info_item {
  display: flex;
  font-size: 12px;
  align-items: center;
  padding-top: 10px;
}
.user_c_modal_cotainer .user_info_item > .label {
  font-size: 12px;
  width: 60px;
}
.user_c_modal_cotainer > .title {
  font-size: 14px;
  font-weight: 600;
  padding-top: 5px;
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

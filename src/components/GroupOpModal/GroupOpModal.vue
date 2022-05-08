<template>
  <n-modal
    v-model:show="cveStore.groupCardIsShow"
    transform-origin="center"
    :style="bodyStyle"
  >
    <n-card
      content-style="padding: 0;"
      style="width: 300px"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <div class="group_info_container" v-if="cardTypeStatus === 'default'">
        <div class="user_c_modal_header_info">
          <!-- 左边盒子 -->
          <div class="left_container">
            <span class="title">{{ groupData.groupName }}</span>
            <div>
              <svg
                class="icon"
                style="width: 12px; height: 14px"
                aria-hidden="true"
              >
                <use :xlink:href="`#openIM-time`"></use>
              </svg>
              <span class="g_create_time">
                {{
                  $day(groupData.createTime * 1000).format('YYYY-MM-DD')
                }}</span
              >
            </div>
          </div>
          <!-- 右边盒子 -->
          <div class="right_container">
            <MyAvatar :src="groupData.faceURL" :size="62" />
          </div>
        </div>
        <!-- 下面内容盒子 -->
        <div class="user_c_modal_cotainer">
          <p class="title">
            {{ t('groupMember') }}：{{ groupData.memberCount }}人
          </p>
          <!-- 头像列表 -->
          <div class="avatar_list">
            <MyAvatar :src="`ic_avatar_07`" :size="33.3" />
            <MyAvatar :src="`ic_avatar_08`" :size="33.3" />
            <MyAvatar :src="`ic_avatar_09`" :size="33.3" />
            <MyAvatar :src="`ic_avatar_10`" :size="33.3" />
            <MyAvatar :src="`ic_avatar_11`" :size="33.3" />
            <n-avatar :style="iconStyle">
              <n-icon> <EllipsisHorizontal /></n-icon>
            </n-avatar>
          </div>
          <!--  -->
          <span class="title">{{ t('groupID') }}：</span>
          <p class="group_id">
            <n-tooltip trigger="hover">
              <template #trigger>
                <svg
                  class="icon"
                  @click="copyFun(groupData.groupID)"
                  aria-hidden="true"
                  style="cursor: pointer; width: 15px; height: 15px"
                >
                  <use xlink:href="#openIM-fuzhi"></use>
                </svg>
              </template>
              {{ groupData.groupID }}
            </n-tooltip>
          </p>
          <n-button @click="sendAddOrSendM" class="add_f_btn" type="primary">{{
            isInGroup() ? t('sendMsg') : t('addGroup')
          }}</n-button>
        </div>
      </div>

      <!-- 发送群组申请 -->
      <SendApplyCard
        v-else
        :name="groupData.groupName"
        :avatar-url="groupData.faceURL"
        :send-fun="sendAddGroupFun"
        :change-page-fun="changeCardTypeStatusFun"
      />
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { defineProps, ref, watch } from 'vue';
import { EllipsisHorizontal } from '@vicons/ionicons5';
import SendApplyCard from '../SendApplyCard/SendApplyCard.vue';
import MyAvatar from '@/components/myAvatar/MyAvatar.vue';
import { useContactsStore } from '@/stores/contacts';
import type { JoinGroupParams, ConversationItem } from '@/tools/im/types';
import { useMessage } from 'naive-ui';
import { im } from '@/tools';
import type { GroupItem } from '../../stores/types/contacts';
import { SessionType } from '../../tools/im/constants/messageContentType';
import { useOpenCveWindow } from '@/hooks/useOpenCveWindow';
import { useCopy } from '@/hooks/useCopy';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useCveStore } from '@/stores/cve';

// props
const props = defineProps<{
  changeGroupCardStatus: (type: boolean) => void;
  changeQuModal?: (type: boolean) => void;
  setInputLoading?: (type: boolean) => void;
  clearModalData?: (type: string) => void;
}>();
/**
 * store
 */
const contactsStore = useContactsStore();
const cveStore = useCveStore();
const router = useRouter();
const { t } = useI18n();
const route = useRoute();
const { openCveWindow } = useOpenCveWindow();
const { copyFun } = useCopy();
// modal style
const bodyStyle = {
  width: '300px',
};
// icon style
const iconStyle = {
  backgroundColor: 'var(--im-theme-primary)',
};
// type 页面
const cardTypeStatus = ref<string>('default');
// useMessage
const message = useMessage();
// 群组信息
const groupData = ref<GroupItem>({
  groupID: '',
  groupName: '',
  notification: '',
  introduction: '',
  faceURL: '',
  ownerUserID: '',
  createTime: 0,
  memberCount: 0,
  status: 0,
  creatorUserID: '',
  groupType: 0,
  ex: '',
});

// 辨别是否加入这个群组
const isInGroup = () => {
  return (
    contactsStore.groupList.findIndex(
      (g) => g.groupID === groupData.value.groupID
    ) > -1
  );
};

// 发送加入群组请求
const sendAddGroupFun = (msg: string) => {
  const param: JoinGroupParams = {
    groupID: groupData.value.groupID,
    reqMsg: msg,
  };
  // 加入群聊
  im.joinGroup(param)
    .then((res) => {
      message.success(t('sendSuc'));
      props.changeGroupCardStatus(false);
      cardTypeStatus.value = 'default';
    })
    .catch((err) => {
      console.log(err);
    });
};

// 改变 cardTypeStatus 的状态
const changeCardTypeStatusFun = (type: string) => {
  cardTypeStatus.value = type;
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

// 发送消息还是发送好友请求
const sendAddOrSendM = () => {
  if (!isInGroup()) return (cardTypeStatus.value = 'send');
  if (
    cveStore.curCve?.groupID !== groupData.value.groupID &&
    !cveStore.curCve
  ) {
    // 发送信息
    getOneCve(groupData.value.groupID, SessionType.GROUPCVE)
      .then((cve) => openCveWindow(cve))
      .catch((err) => message.error(t('notFind') + t('conversation') + '!'));
  }

  props.changeGroupCardStatus(false);
  props.setInputLoading!(false);
  props.changeQuModal!(false);
  if (route.path !== '/cve') return router.push('/cve');
};

// 初始化群组数据
const initGroupInfo = () => {
  // 1. 群聊 id 获取群信息
  console.log(cveStore.groupIDCard);
  im.getGroupsInfo([cveStore.groupIDCard])
    .then((res) => {
      const tmpArr = JSON.parse(res.data);
      props?.setInputLoading!(false);
      if (tmpArr.length === 0) {
        message.info(t('userSearchEmpty'));
        return props.changeGroupCardStatus(false);
      }

      groupData.value = tmpArr[0];
    })
    .catch((err) => {
      message.error(t('actionErrorText'));
    });
  props.clearModalData!('group');
};

watch(
  () => cveStore.groupIDCard,
  () => {
    if (!cveStore.groupIDCard) return;
    initGroupInfo();
  }
);
</script>

<style scoped>
/* 头部样式 */
.user_c_modal_header_info {
  align-items: center;
}
.group_info_container .g_create_time {
  font-size: 12px;
  color: var(--color-text);
  padding-left: 5px;
}

/* 下面内容样式 */
.user_c_modal_cotainer {
  padding: 0 30px;
  height: 220px;
}
.user_c_modal_cotainer > .avatar_list {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.user_c_modal_cotainer > .group_id {
  display: inline-block;
  font-size: 12px;
  color: var(--color-text);
  white-space: pre-wrap;
  word-break: break-all;
  padding-left: 5px;
}
</style>

<template>
  <n-modal
    v-model:show="groupCardIsShow"
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
            <i class="iconfont openIM-time"><span>2020-4-1</span></i>
          </div>
          <!-- 右边盒子 -->
          <div class="right_container">
            <MyAvatar :src="groupData.faceURL" :size="62" />
          </div>
        </div>
        <!-- 下面内容盒子 -->
        <div class="user_c_modal_cotainer">
          <p class="title">群成员：{{ groupData.memberCount }}人</p>
          <!-- 头像列表 -->
          <div class="avatar_list">
            <MyAvatar :size="33.3" />
            <MyAvatar :size="33.3" />
            <MyAvatar :size="33.3" />
            <MyAvatar :size="33.3" />
            <MyAvatar :size="33.3" />
            <n-avatar :style="iconStyle">
              <n-icon> <EllipsisHorizontal /></n-icon>
            </n-avatar>
          </div>
          <!--  -->
          <p class="title">群ID</p>
          <p class="group_id">{{ groupData.groupID }}</p>
          <n-button
            @click="cardTypeStatus = 'send'"
            class="add_f_btn"
            type="primary"
            >{{ isInGroup() ? '发送消息' : '添加群聊' }}</n-button
          >
        </div>
      </div>

      <!-- 发送群组申请 -->
      <!-- e556230f35dee52f5d124980eb49c906 -->
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
import { defineProps, ref } from 'vue';
import { EllipsisHorizontal } from '@vicons/ionicons5';
import SendApplyCard from '../SendApplyCard/SendApplyCard.vue';
import MyAvatar from '@/components/myAvatar/MyAvatar.vue';
import { useContactsStore } from '@/stores/contacts';
import type { JoinGroupParams } from '@/tools/im/types';
import { useMessage } from 'naive-ui';
import { im } from '@/tools';

// props
const props = defineProps<{
  groupCardIsShow: boolean;
  groupData: object;
  changeGroupCardStatus: Function;
}>();
/**
 * store
 */
const contactsStore = useContactsStore();
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

// 辨别是否加入这个群组
const isInGroup = () => {
  return (
    contactsStore.groupList.findIndex(
      (g) => g.groupID === props.groupData.groupID
    ) > -1
  );
};

// 发送加入群组请求
const sendAddGroupFun = (msg: string) => {
  const param: JoinGroupParams = {
    groupID: props.groupData?.groupID,
    reqMsg: msg,
  };
  // 加入群聊
  im.joinGroup(param)
    .then((res) => {
      message.success('发送申请成功');
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
</script>

<style scoped>
/* 头部样式 */
.user_c_modal_header_info {
  align-items: center;
}

/* 下面内容样式 */
.user_c_modal_cotainer {
  padding: 0 30px;
  height: 250px;
}
.user_c_modal_cotainer > .avatar_list {
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
}

.user_c_modal_cotainer > .group_id {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>

<template>
  <div class="section_item_c">
    <!-- 我的好友和最近联系人的item -->
    <header class="section_i_c_h">
      <div class="left_c">
        <p class="nickname">{{ item.nickname }}</p>
        <!-- icon -->
        <div class="icon_c">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#openIM-zhanghuxinxi"></use>
          </svg>
          <n-popconfirm
            @positive-click="deleteFriendFun"
            negative-text="我再想想~"
            positive-text="删除"
          >
            <template #trigger>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#openIM-shanchuhaoyou_huaban1"></use>
              </svg>
            </template>
            {{ `确定要删除 '${item.nickname}' 好友吗？` }}
          </n-popconfirm>
        </div>
      </div>
      <!-- 头像 -->
      <MyAvatar :src="item.faceURL" :size="70" />
    </header>
    <!-- userInfo -->
    <div class="section_user_info_c">
      <p class="title">用户信息</p>
      <p class="user_info_item">
        <label from="nickname">昵称： </label>
        <span id="nickname">{{ item.nickname }}</span>
      </p>
      <p class="user_info_item">
        <label from="remark">备注： </label>
        <span id="remark" v-if="isShowRemarkIcon">{{ item.remark }}</span>
        <span v-if="isShowRemarkIcon" @click="clickRemarkIcon">
          <svg class="icon" style="cursor: pointer" aria-hidden="true">
            <use xlink:href="#openIM-bianji"></use>
          </svg>
        </span>
        <n-input
          v-model:value="remarkValue"
          autofocus
          v-else
          class="remark_input"
          type="text"
          placeholder="输入备注后按回车键保存"
          size="small"
          @keydown.enter="saveRemark"
        />
      </p>
      <p class="user_info_item">
        <label from="gender">性别： </label>
        <span id="gender">{{ item.gender === 0 ? '男' : '女' }}</span>
      </p>
      <p class="user_info_item">
        <label from="phone">电话： </label>
        <span id="phone">{{ item.userID }}</span>
      </p>
      <p class="user_info_item">
        <label from="user_id">ID： </label>
        <span id="user_id">{{ item.userID }}</span>
      </p>

      <!-- 聊天 -->
      <div
        class="to_chat"
        @click="goChatFun(item.userID, SessionType.SINGLECVE)"
      >
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#openIM-message3"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import type { FriendItem } from '@/tools/im/types';
import MyAvatar from '@/components/myAvatar/MyAvatar.vue';
import { SessionType } from '@/tools/im/constants/messageContentType';
import { useMessage } from 'naive-ui';
import { im } from '@/tools';
import type { RemarkFriendParams } from '@/tools/im/types';

const props = defineProps<{ item: FriendItem; goChatFun: () => void }>();
const message = useMessage();
const isShowRemarkIcon = ref<boolean>(true);
// 备注输入框
const remarkValue = ref<string>('');

// click remark icon
const clickRemarkIcon = () => {
  isShowRemarkIcon.value = false;
  remarkValue.value = props.item.remark;
};

// save remark
const saveRemark = () => {
  console.log('执行了');
  if (!remarkValue.value) return message.error('备注信息不能为空');
  const options: RemarkFriendParams = {
    toUserID: props.item.userID,
    remark: remarkValue.value,
  };
  im.setFriendRemark(options)
    .then((res) => message.success('修改备注成功'))
    .catch((err) => message.error('操作失败，请稍后再试！'));
  // 隐藏
  isShowRemarkIcon.value = true;
};

// remove Firend
const deleteFriendFun = () => {
  if (!props.item.userID) return;
  im.deleteFriend(props.item.userID)
    .then((res) => message.success('好友关系解除成功'))
    .catch((err) => message.error('操作失败，请稍后再试！'));
};
</script>

<style>
.section_item_c {
  width: 350px;
  height: 322px;
  border-radius: 10px;
  padding: 40px 30px;
  margin: 0 23px 30px 0px;
  background-color: var(--im-theme-cveItemBg);
  box-shadow: 0px 0px 10.9px rgba(0, 0, 0, 0.14),
    0px 0px 101px rgba(0, 0, 0, 0.02);
}

/* header */
.section_item_c > .section_i_c_h {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 30px;
}
.section_item_c > .section_i_c_h > .left_c .nickname {
  font-size: 16px;
  font-weight: 500;
  padding-bottom: 15px;
}
.section_item_c > .section_i_c_h > .left_c .icon_c > .icon:first-child {
  margin-right: 10px;
}
.section_item_c > .section_i_c_h > .left_c .icon_c > .icon {
  cursor: pointer;
}

/* 内容信息 */
.section_user_info_c {
  position: relative;
}
.section_user_info_c > .title {
  font-size: 16px;
  font-weight: 500;
  padding-bottom: 5px;
}
.section_user_info_c > .user_info_item {
  font-size: 14px;
  color: var(--color-text);
  padding-bottom: 5px;
  display: flex;
}
/* 备注输入框 */
.section_user_info_c > .user_info_item > .remark_input {
  width: 60%;
}
.section_user_info_c > .user_info_item > label {
  display: inline-block;
  width: 50px;
  text-align: center;
}

.section_user_info_c > .to_chat {
  position: absolute;
  right: 0;
  top: 40%;
}
.section_user_info_c > .to_chat > .icon {
  width: 45px;
  height: 45px;
  cursor: pointer;
}

@media (prefers-color-scheme: dark) {
  .section_item_c {
    box-shadow: 0px 0px 10.9px rgba(255, 255, 255, 0.14),
      0px 0px 101px rgba(255, 255, 255, 0.02);
  }
}
</style>

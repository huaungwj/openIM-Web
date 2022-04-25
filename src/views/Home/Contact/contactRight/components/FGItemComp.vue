<template>
  <div class="fg_item_c">
    <!-- 左边信息部分 -->
    <div class="fg_item_left">
      <MyAvatar
        :src="
          contactsStore.conPage === 'nF'
            ? type === 'from'
              ? con.fromFaceURL
              : con.toFaceURL
            : contactsStore.conPage === 'nG' && type === 'from'
            ? con.userFaceURL
            : con.groupFaceURL
        "
        :size="70"
      />
      <div class="fg_user_info">
        <!-- 头部用户名 -->
        <div class="fg_user_info_top">
          <p class="nickname">
            {{
              contactsStore.conPage === 'nF'
                ? type === 'from'
                  ? con.fromNickname
                  : con.toNickname
                : contactsStore.conPage === 'nG' && type === 'from'
                ? con.nickname
                : con.groupName
            }}
          </p>

          <svg
            class="icon"
            aria-hidden="true"
            style="width: 18px; height: 18px"
          >
            <use xlink:href="#openIM-zhanghuxinxi"></use>
          </svg>
        </div>
        <p
          style="font-size: 12px; width: 155px"
          class="apply_msg"
          v-if="contactsStore.conPage === 'nF'"
        >
          请求信息：
          {{
            con.reqMsg
              ? con.reqMsg
              : contactsStore.conPage === 'nF' && type === 'from'
              ? con.fromNickname + ` 请求添加你为朋友`
              : con.toNickname + `请求添加你为朋友`
          }}
        </p>
        <p class="fg_user_info_userID">
          ID: &nbsp;
          <n-tooltip trigger="hover">
            <template #trigger>
              <svg
                class="icon"
                aria-hidden="true"
                style="cursor: pointer; width: 15px; height: 15px"
                @click="
                  copyFun(
                    contactsStore.conPage === 'nF'
                      ? type === 'from'
                        ? con.fromUserID
                        : con.toUserID
                      : contactsStore.conPage === 'nG' && type === 'from'
                      ? con.userID
                      : con.groupID
                  )
                "
              >
                <use xlink:href="#openIM-fuzhi"></use>
              </svg>
            </template>
            {{
              contactsStore.conPage === 'nF'
                ? type === 'from'
                  ? con.fromUserID
                  : con.toUserID
                : contactsStore.conPage === 'nG' && type === 'from'
                ? con.userID
                : con.groupID
            }}
          </n-tooltip>
        </p>

        <!-- 群组验证消息 -->
        <p v-if="contactsStore.conPage === 'nG'">
          <p>申请加入: <a>{{con.groupName}}</a></p>
          <p>申请理由：{{con.reqMsg}}</p>
        </p>
      </div>
    </div>
    <!-- 操作部分 - 仅未处理 handleResult === 0 -->
    <div class="action_c" v-if="initial === 'loading'">
      <n-button type="primary" v-if="type === 'from'" @click="acceptFun"> 同意 </n-button
      ><n-button type="error" ghost v-if="type === 'from'" @click="refuseFun"> 拒绝 </n-button>
      <span v-else>待处理</span>
    </div>
    <!-- 已添加 -->
    <div
      class="to_chat"
      v-if="initial === 'over'"
      @click="
        goChatFun(
          contactsStore.conPage === 'nF'
            ? type === 'from'
              ? con.fromUserID
              : con.toUserID
            : contactsStore.conPage === 'nG' && con.groupID,
          contactsStore.conPage === 'nF'
            ? SessionType.SINGLECVE
            : SessionType.GROUPCVE
        )
      "
    >
      <svg
        class="icon"
        aria-hidden="true"
        style="width: 40px; height: 40px; cursor: pointer"
      >
        <use xlink:href="#openIM-message3"></use>
      </svg>
    </div>
    <!-- 拒绝 -->
    <div class="refuse" v-if="initial === 'refuse'">已拒绝</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type {
  FriendApplicationItem,
  GroupApplicationItem,
} from '@/tools/im/types';
import MyAvatar from '@/components/myAvatar/MyAvatar.vue';
import { useContactsStore } from '@/stores/contacts';
import { SessionType } from '@/tools/im/constants/messageContentType';
import { useCopy } from '@/hooks/useCopy';
import { im } from '@/tools';
import type { AccessFriendParams, AccessGroupParams } from '@/tools/im/types';
import { useMessage } from 'naive-ui';

const props = defineProps<{
  con: GroupApplicationItem & FriendApplicationItem;
  type: string; // from | to
  initial: string; // loading | over | refuse
  goChatFun: (id: string, type: SessionType) => void;
}>();

const { copyFun } = useCopy();
const message = useMessage()

// 同意好友申请 | 同意入群申请
const acceptFun = () => {
  // 1. 判断是入群申请还是好友申请
  if(contactsStore.conPage === 'nF') {
    im.removeBlack(props.con.fromUserID);
    const options:AccessFriendParams = {
      toUserID: props.con.fromUserID,
      handleMsg: ""
    }
    im.acceptFriendApplication(options).then(res => message.success("添加朋友成功")).catch(err => message.error('添加失败'))
  }else {
    // group
    const options:AccessGroupParams = {
      groupID:  props.con.groupID,
      fromUserID: props.con.userID, // 申请者ID
      handleMsg:""
    }
    im.acceptGroupApplication(options)
    .then(res => message.success(`你同意了${props.con.nickname}的入群申请`))
    .catch(err => message.error('添加失败'))
  }
}

// 拒绝好友申请 | 拒绝入群申请
const refuseFun = () => {
  // 1. 判断是入群申请还是好友申请
  if(contactsStore.conPage === 'nF') {
    const options:AccessFriendParams = {
      toUserID: props.con.fromUserID,
      handleMsg: ""
      
    }
    im.refuseFriendApplication(options).then()
    .catch(err => message.error('操作失败，请稍后再试！'))
  }else {
    // 2. 入群申请
    const options:AccessGroupParams = {
      groupID:props.con.groupID,
      fromUserID:props.con.userID,
      handleMsg:""
    }
    im.refuseGroupApplication(options).then()
    .catch(err => message.error('操作失败，请稍后再试！'))
  }
}

const contactsStore = useContactsStore();
</script>

<style>
.fg_item_c {
  width: 351px;
  height: 165px;
  border-radius: 10px;
  padding: 40px 30px;
  margin: 0 23px 30px 0px;
  background-color: var(--im-theme-cveItemBg);
  box-shadow: 0px 0px 10.9px rgba(0, 0, 0, 0.14),
    0px 0px 101px rgba(0, 0, 0, 0.02);
  display: flex;
  justify-content: space-between;
}

.fg_item_c  a {
  color: var(--im-theme-primary)
}

.fg_item_c > .fg_item_left {
  display: flex;
}
.fg_item_c > .fg_item_left > .fg_user_info {
  padding-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.fg_item_c > .fg_item_left > .fg_user_info > .fg_user_info_top > .nickname {
  font-size: 16px;
  font-weight: 500;
  display: inline-block;
  padding-right: 10px;
}
.fg_item_c > .fg_item_left > .fg_user_info > .fg_user_info_userID {
  font-size: 12px;
  color: var(--color-text);
  width: 100px;
}

/* 操作部分 */
.fg_item_c > .action_c {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* 拒绝 */
.fg_item_c > .refuse {
  font-size: 12px;
}
</style>

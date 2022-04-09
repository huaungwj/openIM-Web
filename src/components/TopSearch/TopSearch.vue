<template>
  <div class="top_search_container">
    <!-- search input -->
    <n-input placeholder="搜索" size="small">
      <template #prefix>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#openIM-search"></use>
        </svg>
      </template>
    </n-input>

    <!-- add button -->
    <n-dropdown
      trigger="hover"
      :options="addMenuOptions"
      @select="handleSelectFun"
    >
      <svg class="icon add_button pointer" aria-hidden="true">
        <use xlink:href="#openIM-add"></use>
      </svg>
    </n-dropdown>

    <!-- 模态框 -->
    <n-modal :style="modalStyle" v-model:show="isShowModal" preset="card">
      <template #header>
        <div>
          {{
            operType === 'addFriends'
              ? '添加好友'
              : operType === 'addGroupChat'
              ? '添加群聊'
              : '创建群聊'
          }}
        </div>
      </template>
      <div class="top_search_modal_container">
        <n-input
          class="modal_input"
          v-model:value="modalInputValue"
          type="text"
          :placeholder="
            operType === 'addFriends'
              ? '请输入用户ID'
              : operType === 'addGroupChat'
              ? '请输入群聊ID'
              : '请输入群名称'
          "
          :loading="inputLoading"
        />
      </div>
      <template #action>
        <div class="top_search_modal_footer">
          <n-button type="primary" @click="actionSearchFun"> 确定 </n-button>
          <n-button class="cancel_btn" @click="isShowModal = false"
            >取消</n-button
          >
        </div>
      </template>
    </n-modal>

    <!-- 用户card props show -->
    <UserCardModal
      :user-card-is-show="userCardIsShow"
      :friend-data="friendData"
      :change-user-card-status="changeCardStatus"
    />

    <!-- 群组modal -->
    <GroupOpModal
      :group-card-is-show="groupCardIsShow"
      :group-data="groupData"
      :change-group-card-status="changeCardStatus"
    />
  </div>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import type { Component } from 'vue';
import { NIcon, useMessage } from 'naive-ui';
import UserCardModal from '@/components/UserCardModal/UserCardModal.vue';
import GroupOpModal from '../GroupOpModal/GroupOpModal.vue';
import {
  PersonAddSharp as AddFriendsIcon,
  People as AddGroupIcon,
  ChatbubblesOutline as createGroupIcon,
} from '@vicons/ionicons5';
import { im } from '@/tools';
import { useUserStore } from '@/stores/user';
import type { PartialUserItem } from '@/tools/im/types';

// 使用 use
const message = useMessage();
// userStore
const userStore = useUserStore();

// 自我信息
let selfInfo: PartialUserItem = {
  userID: userStore.selfInfo.userID,
};

// 渲染 icon
const renderIcon = (icon: Component) => {
  console.log(icon);
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
};

// 是否显示模态框
const isShowModal = ref<boolean>(false);
// modal 样式
const modalStyle = {
  width: '500px',
};
// 操作 type
const operType = ref<string | boolean>('');
// 添加好友 And 添加群组 input value
const modalInputValue = ref<string>('');
// 搜索框 loading
const inputLoading = ref<boolean>(false);
// 搜索朋友数据
const friendData = ref<object>({});
// 搜索群聊数据
const groupData = ref<object>({});
// 朋友数据卡片是否显示
const userCardIsShow = ref<boolean>(false);
// menu
const addMenuOptions = [
  {
    label: '添加好友',
    key: 'addFriends',
    icon: renderIcon(AddFriendsIcon),
  },
  {
    label: '添加群聊',
    key: 'addGroupChat',
    icon: renderIcon(AddGroupIcon),
  },
  {
    label: '创建群聊',
    key: 'createGroupChat',
    icon: renderIcon(createGroupIcon),
  },
];
// 控制群组卡片是否显示
const groupCardIsShow = ref<boolean>(false);

/**
 * 下拉选择发生变化的回调
 * @param key
 */
const handleSelectFun = (key: string) => {
  // 1. 清空输入框
  modalInputValue.value = '';
  operType.value = key;
  isShowModal.value = true;
};

/**
 * 改变朋友、群组卡片模态框的状态
 * @param type
 */
const changeCardStatus = (type: boolean) => {
  if (userCardIsShow.value) {
    // 用户卡片为true说明当前在用user
    userCardIsShow.value = type;
  } else if (groupCardIsShow.value) {
    groupCardIsShow.value = type;
  }
};

// 根据 id 获取用户信息
const searchFirendFun = () => {
  // 1. 判断 userID 是否是自个账号
  if (userStore.selfInfo.userID === modalInputValue.value) {
    message.info('不能添加自己！');
    return false;
  }
  // 1. 根据 朋友ID 搜索
  im.getUsersInfo([modalInputValue.value])
    .then((res) => {
      inputLoading.value = false;
      let tmpArr = JSON.parse(res.data);
      if (tmpArr.length > 0) {
        friendData.value = tmpArr[0].friendInfo
          ? tmpArr[0].friendInfo
          : tmpArr[0].publicInfo;
        userCardIsShow.value = true;
        console.log(
          tmpArr[0].friendInfo ? tmpArr[0].friendInfo : tmpArr[0].publicInfo
        );
      } else {
        message.info('用户搜索结果为空');
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// 添加群聊
const searchGroupFun = () => {
  // 1. 群聊 id 获取群信息
  im.getGroupsInfo([modalInputValue.value])
    .then((res) => {
      inputLoading.value = false;
      const tmpArr = JSON.parse(res.data);
      if (tmpArr.length > 0) {
        console.log(tmpArr);
        groupData.value = tmpArr[0];
        groupCardIsShow.value = true;
      } else {
        message.info('用户搜索结果为空');
      }
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

// 创建群聊
const createGroupFun = () => {};

// 搜索朋友、搜索群聊、创建群聊
const actionSearchFun = () => {
  if (!modalInputValue.value) {
    message.error('请输入内容后继续');
    return false;
  } else if (operType.value === 'addFriends') {
    userCardIsShow.value = false;

    searchFirendFun();
  } else if (operType.value === 'addGroupChat') {
    // 添加群聊
    console.log('添加群聊');
    searchGroupFun();
  } else {
    // 创建群聊
    createGroupFun();
  }
  inputLoading.value = true;
};
</script>

<style>
/* 头部盒子 */
.top_search_container {
  display: flex;
  align-items: center;
  width: 25.8%;
  background-color: var(--im-theme-topSearchBg) !important;
  z-index: 1;
  padding: 10px;
  position: fixed;
}
/* 头部添加按钮 */
.top_search_container > .add_button {
  font-size: 25px;
  margin-left: 10px;
  outline: none;
}
/* 内容部分 */
.top_search_modal_container > .modal_input {
  margin-bottom: 20px;
}
/* 模态框底部按钮 */
.top_search_modal_footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}
/* 取消按钮 */
.top_search_modal_footer > .cancel_btn {
  margin-left: 10px;
}
</style>

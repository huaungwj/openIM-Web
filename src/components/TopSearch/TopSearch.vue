<template>
  <div class="top_search_container">
    <!-- search input -->
    <n-input
      placeholder="搜索"
      size="small"
      v-model:value="searchText"
      @keydown.enter="searchFun"
    >
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
    <n-modal
      display-directive="show"
      :style="modalStyle"
      v-model:show="isShowModal"
      preset="card"
      transform-origin="center"
    >
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
      display-directive="show"
      :change-user-card-status="changeCardStatus"
      :change-qu-modal="changeQuModal"
      :set-input-loading="setInputLoading"
      :clearModalData="clearModalData"
      transform-origin="center"
    />

    <!-- 群组modal -->
    <GroupOpModal
      display-directive="show"
      :change-group-card-status="changeCardStatus"
      :change-qu-modal="changeQuModal"
      :set-input-loading="setInputLoading"
      :clearModalData="clearModalData"
      transform-origin="center"
    />
    <!-- :on-after-leave="clearModalData" -->
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
import { useUserStore } from '@/stores/user';
import { useCveStore } from '@/stores/cve';
import { useContactsStore } from '@/stores/contacts';
import { useCommonStore } from '@/stores/common';
import type {
  ConversationItem,
  PartialUserItem,
  FriendItem,
  FriendApplicationItem,
  GroupApplicationItem,
  GroupItem,
} from '@/tools/im/types';
import { useRoute } from 'vue-router';

// 渲染 icon
const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
};

// 使用 use
const message = useMessage();
const cveStore = useCveStore();
const userStore = useUserStore();
const contactsStore = useContactsStore();
const commonStore = useCommonStore();
const route = useRoute();
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
// 搜索文本、会话、好友等
const searchText = ref<string>('');
// 原会话列表
const pCveList = ref<ConversationItem[]>([]);
// 原好友列表
const pFriList = ref<FriendItem[]>([]);
// 原好友申请列表
const pRecvFriList = ref<FriendApplicationItem[]>([]);
// 原已发送好友申请的列表
const pSentFriList = ref<FriendApplicationItem[]>([]);
// 原收到的加入群聊申请列表。
const pRecGroupList = ref<GroupApplicationItem[]>([]);
// 原发出的加入群聊申请列表。
const pSentGroupList = ref<GroupApplicationItem[]>([]);
// 原群聊列表
const pGroupList = ref<GroupItem[]>([]);

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

// 自我信息
let selfInfo: PartialUserItem = {
  userID: userStore.selfInfo.userID,
};

// 最外层的模态框状态控制
const changeQuModal = (type: boolean) => {
  isShowModal.value = type;
};

/**
 * 下拉选择发生变化的回调
 * @param key
 */
const handleSelectFun = (key: string) => {
  if (key === 'createGroupChat')
    commonStore.setcreateGARelayMTpye('createGroup');
  if (key !== 'createGroupChat') {
    // 1. 清空输入框
    modalInputValue.value = '';
    operType.value = key;
    isShowModal.value = true;
  }
};

/**
 * 改变朋友、群组卡片模态框的状态
 * @param type
 */
const changeCardStatus = (type: boolean) => {
  if (cveStore.friendCardIsShow) {
    // 用户卡片为true说明当前在用user
    cveStore.setFriCardStatus(type);
  } else if (cveStore.groupCardIsShow) {
    cveStore.setGroupCardStatus(type);
  }
};

// 根据 id 获取用户信息
const searchFirendFun = () => {
  cveStore.setFriCardStatus(false);
  // 1. 判断 userID 是否是自个账号
  if (userStore.selfInfo.userID === modalInputValue.value) {
    setInputLoading(false);
    message.info('不能添加自己！');
    return false;
  }
  cveStore.setFriIDCard(modalInputValue.value);
  cveStore.setFriCardStatus(true);
};

// 设置输入框 loading
const setInputLoading = (type: boolean) => {
  inputLoading.value = type;
};

// 搜索朋友、搜索群聊、创建群聊
const actionSearchFun = () => {
  if (!modalInputValue.value) {
    message.error('请输入内容后继续');
    return false;
  } else if (operType.value === 'addFriends') {
    cveStore.setFriCardStatus(false);
    searchFirendFun();
  } else if (operType.value === 'addGroupChat') {
    // 添加群聊
    cveStore.setGroupIDCard(modalInputValue.value);
    cveStore.setGroupCardStatus(true);
  }
  inputLoading.value = true;
};

// 清空数据
const clearModalData = (type: string) => {
  if (type === 'single') return cveStore.setFriIDCard('');

  return cveStore.setGroupIDCard('');
};

/**
 *
 * @param p 原数组
 * @param store store对象
 * @param storeValue store值
 * @param setStoreFun setStore方法
 * @param filterFun 过滤函数
 */
const commActionFun = (
  p: ref<any[]>,
  store: any,
  storeValue: string,
  setStoreFun: (data: any) => void,
  filterFun: () => any[]
) => {
  p.value.length === 0 && (p.value = [...store[storeValue]]);
  if (!store[storeValue]) return setStoreFun(p.value);
  let tmp = filterFun();

  if (tmp.length === 0) return message.info('没有找到相关的信息');
  setStoreFun(tmp);
};

// 搜索朋友列表，会话列表等
const searchFun = () => {
  if (route.path === '/cve') {
    commActionFun(pCveList, cveStore, 'cves', cveStore.setCveList, () => {
      return pCveList.value.filter(
        (item: ConversationItem) =>
          item.showName.toLowerCase().indexOf(searchText.value) >= 0
      );
    });
  } else if (route.path === '/contacts') {
    if (['tC', 'mF'].some((item) => item === contactsStore.conPage)) {
      commActionFun(
        pFriList,
        contactsStore,
        'friendList',
        contactsStore.setFriendList,
        () => {
          return pFriList.value.filter(
            (item: FriendItem) =>
              item.nickname.toLowerCase().indexOf(searchText.value) >= 0 ||
              item.remark.toLowerCase().indexOf(searchText.value) >= 0 ||
              item.userID.toLowerCase().indexOf(searchText.value) >= 0 ||
              item.phoneNumber.toLowerCase().indexOf(searchText.value) >= 0
          );
        }
      );
    } else if (
      contactsStore.conPage === 'nF' ||
      contactsStore.conPage === 'nG'
    ) {
      const type = contactsStore.conPage === 'nF' ? true : false;
      if (contactsStore.newFGList.type === 'from') {
        commActionFun(
          type ? pRecvFriList : pRecGroupList,
          contactsStore,
          type ? 'recvFriendApplicationList' : 'recvGroupApplicationList',
          type
            ? contactsStore.setRecvFriendApplicationList
            : contactsStore.setRecvGroupApplicationList,
          () => {
            return type
              ? pRecvFriList.value.filter(
                  (item: FriendApplicationItem) =>
                    item.fromUserID.toLowerCase().indexOf(searchText.value) >=
                      0 ||
                    item.fromNickname.toLowerCase().indexOf(searchText.value) >=
                      0
                )
              : pRecGroupList.value.filter(
                  (item: GroupApplicationItem) =>
                    item.groupID.toLowerCase().indexOf(searchText.value) >= 0 ||
                    item.groupName.toLowerCase().indexOf(searchText.value) >=
                      0 ||
                    item.nickname.toLowerCase().indexOf(searchText.value) >=
                      0 ||
                    item.userID.toLowerCase().indexOf(searchText.value) >= 0
                );
          }
        );
      } else {
        commActionFun(
          type ? pSentFriList : pSentGroupList,
          contactsStore,
          type ? 'sentFriendApplicationList' : 'sentGroupApplicationList',
          type
            ? contactsStore.setSentFriendApplicationList
            : contactsStore.setSentGroupApplicationList,
          () => {
            return type
              ? pSentFriList.value.filter(
                  (item: FriendApplicationItem) =>
                    item.toUserID.toLowerCase().indexOf(searchText.value) >=
                      0 ||
                    item.toNickname.toLowerCase().indexOf(searchText.value) >= 0
                )
              : pSentGroupList.value.filter(
                  (item: GroupApplicationItem) =>
                    item.groupID.toLowerCase().indexOf(searchText.value) >= 0 ||
                    item.groupName.toLowerCase().indexOf(searchText.value) >=
                      0 ||
                    item.nickname.toLowerCase().indexOf(searchText.value) >=
                      0 ||
                    item.userID.toLowerCase().indexOf(searchText.value) >= 0
                );
          }
        );
      }
    } else if (contactsStore.conPage === 'mG') {
      commActionFun(
        pGroupList,
        contactsStore,
        'groupList',
        contactsStore.setGroupList,
        () => {
          return pGroupList.value.filter(
            (item) =>
              item.groupID.toLowerCase().indexOf(searchText.value) >= 0 ||
              item.groupName.toLowerCase().indexOf(searchText.value) >= 0
          );
        }
      );
    }
  }
};
</script>

<style>
/* 头部盒子 */
.top_search_container {
  display: flex;
  align-items: center;
  width: 26.7vw;
  height: 71px;
  background-color: var(--im-theme-chatPageBg) !important;
  border-bottom: 1px solid var(--im-theme-chatPageSolid);
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

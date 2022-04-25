<template>
  <n-drawer
    class="setting_drawer"
    :show="drawerStatus !== 'cancel'"
    :width="360"
    placement="right"
    :on-mask-click="cancelOutDrawer"
    :on-esc="cancelOutDrawer"
    :trap-focus="false"
  >
    <n-drawer-content title="设置" v-if="drawerStatus === 'setting'">
      <!-- {{ contactsStore.groupInfo }} -->
      <!-- 头像名称部分 -->
      <div class="drawer_item avatar_nickname_c">
        <MyAvatar
          :src="
            isSingleCve(cveStore.curCve)
              ? cveStore.curCve.faceURL
              : contactsStore.groupInfo.faceURL
          "
          :size="50"
        />
        <div class="nickname_c">
          <span class="nickname" @click="showDeInfoFun">{{
            isSingleCve(cveStore.curCve)
              ? cveStore.curCve.showName
              : contactsStore.groupInfo.groupName
          }}</span>
          <p
            @click="
              () => {
                innerDrawerStatus = true;
                innerDrawerPage = 'editGroupInfo';
              }
            "
            v-if="
              !isSingleCve(cveStore.curCve) &&
              userStore.selfInfo.userID == contactsStore.groupInfo.ownerUserID
            "
            class="nickname_action"
          >
            修改群信息
          </p>
        </div>
        <!-- right -->
        <svg
          class="icon"
          style="cursor: pointer"
          aria-hidden="true"
          @click="showDeInfoFun"
        >
          <use xlink:href="#openIM-arrow-right"></use>
        </svg>
      </div>

      <!-- 群成员 -->
      <div class="drawer_item group_c" v-if="!isSingleCve(cveStore.curCve)">
        <div class="top_c">
          <span class="title">群成员</span>
          <span class="right_number_icon">
            <span>{{ contactsStore.groupMemberList.length }}</span>
            <svg
              class="icon"
              aria-hidden="true"
              style="cursor: pointer"
              @click="
                () => {
                  innerDrawerStatus = true;
                  innerDrawerPage = 'groupMember';
                }
              "
            >
              <use xlink:href="#openIM-arrow-right"></use>
            </svg>
          </span>
        </div>
        <!-- memberList -->
        <div class="member_a_c">
          <div
            v-for="member in contactsStore.groupMemberList
              .slice(0, 4)
              .reverse()"
            :key="member.userID"
            class="avatar_item"
          >
            <svg
              v-show="
                reduceIconStatus &&
                member.userID !== contactsStore.groupInfo.ownerUserID
              "
              class="icon a_reduce_icon"
              style="color: #ec6a5e"
              aria-hidden="true"
              @click="reduceMemberFun([member.userID])"
            >
              <use xlink:href="#openIM-jian"></use>
            </svg>
            <my-avatar
              style="margin-right: 10px"
              :src="member.faceURL"
              :size="40"
            />
          </div>
          <svg class="icon group_icon" @click="addFriendFun" aria-hidden="true">
            <use xlink:href="#openIM-add1"></use></svg
          ><svg
            class="icon group_icon"
            v-if="
              userStore.selfInfo.userID === contactsStore.groupInfo.ownerUserID
            "
            style="color: #ec6a5e"
            aria-hidden="true"
            @click="reduceIconStatus = !reduceIconStatus"
          >
            <use xlink:href="#openIM-remove"></use>
          </svg>
        </div>
      </div>
      <!-- 群备注 -->
      <div class="drawer_item g_remark_c" v-if="!isSingleCve(cveStore.curCve)">
        <span class="title">群备注</span>
        <div style="display: flex">
          <div class="right_remark">
            <span class="remark">群聊的备注仅自己可见</span>
          </div>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#openIM-bianji"></use>
          </svg>
        </div>
      </div>
      <!-- 群ID -->
      <div class="drawer_item g_remark_c" v-if="!isSingleCve(cveStore.curCve)">
        <span class="title">群ID</span>
        <div style="display: flex">
          <div class="right_remark">
            <span class="remark">{{ contactsStore.groupInfo.groupID }}</span>
          </div>
          <svg
            class="icon"
            aria-hidden="true"
            style="cursor: pointer"
            @click="copyFun(contactsStore.groupInfo.groupID)"
          >
            <use xlink:href="#openIM-fuzhi"></use>
          </svg>
        </div>
      </div>
      <!-- 置顶 -->
      <div class="drawer_item g_remark_c">
        <span class="title">置顶</span>
        <n-switch :value="pinnedStatus" :on-update:value="pinnedChange" />
      </div>
      <!-- 添加到黑名单 -->
      <div class="drawer_item g_remark_c" v-if="isSingleCve(cveStore.curCve)">
        <span class="title">添加到黑名单</span>
        <n-switch
          :value="ship === ShipType.Black"
          :on-update:value="shipChange"
        />
      </div>
      <!-- 免打扰 -->
      <div class="drawer_item g_remark_c">
        <span class="title">免打扰</span>
        <n-switch :value="recvStatus" :on-update:value="recvStatusChange" />
      </div>
      <!-- 按钮组 -->
      <div class="g_remark_c" style="justify-content: space-around">
        <n-button strong secondary type="primary" @click="quitGroupFun">
          {{ isSingleCve(cveStore.curCve) ? '删除好友' : '退出群聊' }}
        </n-button>
        <n-button
          v-if="
            userStore.selfInfo.userID === contactsStore.groupInfo.ownerUserID &&
            !isSingleCve(cveStore.curCve)
          "
          tertiary
          type="error"
          @click="message.info('暂不支持,正在开发中...')"
        >
          解散群聊
        </n-button>
      </div>
    </n-drawer-content>
    <n-drawer-content title="群公告" v-if="drawerStatus === 'groupNotice'">
      <Empty imgSrc="/src/assets/images/empty5.png" :width="220" :height="230">
        <template #header>
          <p>暂无数据</p>
        </template>
      </Empty>
    </n-drawer-content>

    <!-- 第二个模态框 - 群成员 -->

    <n-drawer
      class="setting_drawer"
      v-model:show="innerDrawerStatus"
      :width="360"
      placement="right"
    >
      <n-drawer-content title="群成员" v-if="innerDrawerPage === 'groupMember'">
        <!-- 搜索框 -->
        <n-input
          placeholder="搜索"
          size="medium"
          v-model:value="searchGroupText"
          @keydown.enter="searchGroupFun"
        >
          <template #prefix>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#openIM-search"></use>
            </svg>
          </template>
        </n-input>

        <!-- 群员卡片列表 -->
        <div class="group_list_card">
          <li
            class="group_list_item"
            v-for="member in groupMemberList"
            :key="member.userID"
          >
            <div class="left_info">
              <my-avatar :src="member.faceURL" :size="40" />
              <div>
                <span class="title"
                  >{{ member.nickname }}
                  <n-tag
                    type="warning"
                    v-if="contactsStore.groupInfo.ownerUserID === member.userID"
                    size="small"
                    >群主</n-tag
                  >
                </span>
                <p class="online">{{ parseStatus(member.userID) }}</p>
              </div>
            </div>
            <div
              class="right_icon"
              v-if="
                userStore.selfInfo.userID ===
                contactsStore.groupInfo.ownerUserID
              "
            >
              <svg
                class="icon"
                style="cursor: pointer"
                v-if="contactsStore.groupInfo.ownerUserID !== member.userID"
                aria-hidden="true"
                @click="transferGroupFun(member.userID)"
              >
                <use xlink:href="#openIM-zhuanrangzhuanqu1"></use>
              </svg>
              <svg
                @click="reduceMemberFun([member.userID])"
                class="icon"
                style="cursor: pointer"
                aria-hidden="true"
              >
                <use xlink:href="#openIM-remove2"></use>
              </svg>
            </div>
          </li>
        </div>
      </n-drawer-content>
      <n-drawer-content title="编辑群信息" v-else>
        <!-- 头像部分 -->
        <div class="drawer_item group_edit_item">
          <span class="title">群头像</span>
          <div class="right_remark">
            <!-- 上传头像 -->
            <UplaodAvatar
              :getUplaodURL="getUplaodURL"
              :faceURL="newGroupInfo.faceURL"
            />
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#openIM-arrow-right"></use>
            </svg>
          </div>
        </div>
        <!-- 名称部分 -->
        <div class="drawer_item group_edit_item">
          <div class="title">群名称</div>
          <div class="right_remark">
            <n-input
              type="text"
              placeholder="请输入群名称"
              v-model:value="newGroupInfo.groupName"
            />
          </div>
        </div>
        <!-- 群描述 -->
        <div class="drawer_item group_edit_item">
          <div class="title">群名称</div>
          <div class="right_remark">
            <n-input
              type="textarea"
              placeholder="请输入群描述"
              v-model:value="newGroupInfo.introduction"
            />
          </div>
        </div>

        <div style="text-align: center">
          <n-button strong secondary type="primary" @click="saveGroupInfo">
            保存
          </n-button>
        </div>
      </n-drawer-content>
    </n-drawer>
  </n-drawer>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import MyAvatar from '@/components/myAvatar/MyAvatar.vue';
import UplaodAvatar from '@/components/UploadAvatar/UploadAvatar.vue';
import Empty from '@/components/Empty/Empty.vue';
import Bus from '@/tools/bus';
import { useContactsStore } from '@/stores/contacts';
import { useCveStore } from '@/stores/cve';
import { useCommonStore } from '@/stores/common';
import { useUserStore } from '@/stores/user';
import { useMessage, useDialog } from 'naive-ui';
import { isSingleCve, im } from '@/tools';
import type {
  FriendItem,
  InviteGroupParams,
  GroupMemberItem,
  PinCveParams,
  BlackItem,
  TransferGroupParams,
  GroupBaseInfo,
} from '@/tools/im/types';
import { OptType } from '@/tools/im/types';
import { useCopy } from '@/hooks/useCopy';

enum ShipType {
  Nomal = 0,
  Friend = 1,
  Black = 2,
}

type newGroupInfoType = {
  faceURL: string;
  groupName: string;
  introduction: string;
};

type GroupInfo = {
  groupID: string;
  groupInfo: GroupBaseInfo;
};

const drawerStatus = ref<string | boolean>('cancel');
const innerDrawerStatus = ref<boolean | string>(false);
const innerDrawerPage = ref<string>('groupMember');
const cveStore = useCveStore();
const dialog = useDialog();
const contactsStore = useContactsStore();
const commonStore = useCommonStore();
const userStore = useUserStore();
const message = useMessage();
const reduceIconStatus = ref<boolean>(false);
const { copyFun } = useCopy();
const pinnedStatus = ref<boolean>(cveStore.curCve.isPinned);
const recvStatus = ref<boolean>(cveStore.curCve.recvMsgOpt !== 0);
const ship = ref<ShipType>();
const groupMemberList = ref<GroupMemberItem[]>([]);
const searchGroupText = ref<string>('');
const newGroupInfo = ref<newGroupInfoType>({
  faceURL: '',
  groupName: '',
  introduction: '',
});

const cancelOutDrawer = () => {
  drawerStatus.value = 'cancel';
};

const showDeInfoFun = () => {
  if (isSingleCve(cveStore.curCve)) {
    cveStore.setFriCardStatus(true);
    cveStore.setFriIDCard(cveStore.curCve.userID);
  } else {
    cveStore.setGroupCardStatus(true);
    cveStore.setGroupIDCard(cveStore.curCve.groupID);
  }
};

// 添加朋友入群
const addFriendFun = () => {
  commonStore.setcreateGARelayMTpye('addGroupMember');
};

const pinnedChange = (value: boolean) => {
  pinnedStatus.value = value;
  const options: PinCveParams = {
    conversationID: cveStore.curCve.conversationID,
    isPinned: value,
  };
  im.pinConversation(options)
    .then((res) => message.success(value ? '置顶成功' : '取消置顶成功'))
    .catch((err) => {
      message.error('操作失败，请稍后再试!');
    });
};

const recvStatusChange = (value: boolean) => {
  console.log(value);
  recvStatus.value = value;
  const options = {
    conversationIDList: [cveStore.curCve.conversationID],
    opt:
      cveStore.curCve.recvMsgOpt === OptType.Nomal
        ? OptType.WithoutNotify
        : OptType.Nomal,
  };
  im.setConversationRecvMessageOpt(options)
    .then(() => {
      const tmp = cveStore.curCve;
      tmp.recvMsgOpt =
        cveStore.curCve.recvMsgOpt !== OptType.Nomal
          ? OptType.Nomal
          : OptType.WithoutNotify;
      cveStore.setCurCve(tmp);
    })
    .catch((err) => message.error('操作超时，请稍后再试！'));
};

const shipChange = (value: boolean) => {
  if (value) {
    ship.value = ShipType.Black;
    im.addBlack(cveStore.curCve.userID)
      .then((res) => message.success('添加黑名单成功！'))
      .catch((err) => message.error('添加黑名单失败'));
  } else {
    ship.value = ShipType.Nomal;
    im.removeBlack(cveStore.curCve.userID).catch((err) =>
      message.error('移除黑名单失败！')
    );
  }
};

const quitGroupFun = () => {
  if (isSingleCve(cveStore.curCve)) {
    dialog.warning({
      title: '警告',
      content: '你确定要删除这个好友吗？',
      positiveText: '去意已决！',
      negativeText: '再想想吧！',
      onPositiveClick: () => {
        // 加入黑名单
        im.addBlack(cveStore.curCve.userID);
        im.deleteFriend(cveStore.curCve.userID)
          .then((res) => {
            delCve();
            message.success('解除好友关系成功！');
          })
          .catch((err) => message.error('解除好友关系失败！'));
        cancelOutDrawer();
      },
    });
  } else {
    dialog.warning({
      title: '警告',
      content: '你确定退出这个群聊吗？',
      positiveText: '去意已决！',
      negativeText: '再想想吧！',
      onPositiveClick: () => {
        if (userStore.selfInfo.userID === contactsStore.groupInfo.ownerUserID)
          return message.warning('请转让群组后，再退出群聊');

        im.quitGroup(cveStore.curCve.groupID)
          .then((res) => {
            message.success('退出成功！');
            cveStore.setCurCve(null);
          })
          .catch((err) => message.error('退出群聊失败'));
        cancelOutDrawer();
      },
    });
  }
};

// 删除会话
const delCve = () => {
  console.log(cveStore.curCve.conversationID);
  im.deleteConversation(cveStore.curCve.conversationID).then((res) => {
    const tarray = [...cveStore.cves];
    const farray = tarray.filter(
      (c) => c.conversationID !== cveStore.curCve.conversationID
    );
    cveStore.setCveList(farray);
    cveStore.setCurCve(null);
  });
};

// 减少成员
const reduceMemberFun = (userIDList: string[]) => {
  // 不允许踢出群主
  if (userIDList.includes(contactsStore.groupInfo.ownerUserID)) return false;
  console.log(userIDList);
  const options: InviteGroupParams = {
    groupID: cveStore.curCve.groupID,
    reason: '',
    userIDList: userIDList,
  };
  dialog.warning({
    title: '警告',
    content: '你确定要踢出此成员吗？',
    positiveText: '去意已决！',
    negativeText: '再想想吧！',
    onPositiveClick: () => {
      im.kickGroupMember(options)
        .then((res) => {
          message.success('踢出成功！');
          // update groupMemberList
          const tmp = contactsStore.groupMemberList.filter(
            (member: GroupMemberItem) => !userIDList.includes(member.userID)
          );
          contactsStore.setGroupMemberList(tmp);
        })
        .catch((err) => message.error('操作失败，请稍后再试！'));
    },
  });
};

const initShip = () => {
  if (!isSingleCve(cveStore.curCve)) return;
  let flag = 0;
  if (
    contactsStore.friendList.find(
      (item: FriendItem) => item.userID === cveStore.curCve?.userID
    )
  ) {
    flag = 1;
  } else if (
    contactsStore.blackList.find(
      (item: BlackItem) => item.userID === cveStore.curCve?.userID
    )
  ) {
    flag = 2;
  }
  ship.value = flag;
};

const parseStatus = (userID: string) => {
  let str = '离线';
  const item = contactsStore.member2status[userID];
  if (item) {
    if (item.status === 'online') {
      str = '';
      item.detailPlatformStatus?.map((pla) => {
        if (pla.status === 'online') {
          str += `${pla.platform}/`;
        }
      });
      str = str.slice(0, -1) + '在线';
    }
  }
  return `[${str}]`;
};

/**
 * @param data 进行群主排序的群员列表
 */
const sortGroupMember = (data: GroupMemberItem[], ownerUserID: string) => {
  const tmp = [...data];
  const index = data.findIndex(
    (member: GroupMemberItem) => ownerUserID === member.userID
  );
  const copy = tmp[index];
  if (index !== -1) {
    tmp.splice(index, 1);
    tmp.splice(0, 0, copy);
  }
  groupMemberList.value = tmp;
};
/**
 * 搜索群员
 */
const searchGroupFun = () => {
  let str: string = searchGroupText.value;
  if (str === '') return sortGroupMember(contactsStore.groupMemberList);
  const tmp = groupMemberList.value.filter((member: GroupMemberItem) => {
    return member.nickname.toLowerCase().indexOf(str) >= 0;
  });
  groupMemberList.value = tmp;
};

/**
 * 转让群主
 * @param userID 用户ID
 */
const transferGroupFun = (userID: string) => {
  dialog.warning({
    title: '警告',
    content: '你确定要转让群主吗？',
    positiveText: '深思熟虑后的决定！',
    negativeText: '不了不了！',
    onPositiveClick: () => {
      const options: TransferGroupParams = {
        groupID: cveStore.curCve.groupID,
        newOwnerUserID: userID,
      };
      im.transferGroupOwner(options)
        .then((res) => {
          sortGroupMember(contactsStore.groupMemberList, userID);
          message.success('转让成功');
        })
        .catch((err) => message.error('转让失败'));
    },
  });
};

/**
 * 获取上传头像地址
 * @param url 地址
 */
const getUplaodURL = (url: string) => {
  const tmp = { ...newGroupInfo.value };
  tmp.faceURL = url;
  newGroupInfo.value = tmp;
};

/**
 * 保存群信息
 */
const saveGroupInfo = () => {
  console.log(newGroupInfo.value);
  const groupInfo: GroupBaseInfo = newGroupInfo.value;
  const options: GroupInfo = {
    groupID: cveStore.curCve.groupID,
    groupInfo,
  };
  im.setGroupInfo(options)
    .then((res) => message.success('修改成功！'))
    .catch((err) => message.error('修改失败！'));

  innerDrawerStatus.value = false;
};

watch(
  () => cveStore.curCve,
  () => {
    if (!cveStore.curCve) return;
    initShip();
    if (
      pinnedStatus.value === cveStore.curCve.isPinned ||
      recvStatus.value === cveStore.curCve.recvStatus
    )
      return;
    pinnedStatus.value = cveStore.curCve.isPinned;
    recvStatus.value = Boolean(cveStore.curCve.recvMsgOpt !== 0);
  }
);

watch([() => contactsStore.blackList, () => contactsStore.friendList], () => {
  initShip();
});

watch(
  [() => contactsStore.groupMemberList, () => contactsStore.groupInfo],
  () => {
    newGroupInfo.value = {
      faceURL: contactsStore.groupInfo.faceURL,
      groupName: contactsStore.groupInfo.groupName,
      introduction: contactsStore.groupInfo.introduction,
    };
    sortGroupMember(
      contactsStore.groupMemberList,
      contactsStore.groupInfo.ownerUserID
    );
  }
);

onMounted(() => {
  Bus.$on('SETDRAWERSTATUS', (status: string) => {
    drawerStatus.value = status;
  });
});
</script>

<style>
.setting_drawer .drawer_item,
.setting_drawer .group_list_item {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  background: var(--im-theme-cveItemBg);
  border-radius: 15px;
  padding: 10px 15px;
  font-size: 12px;
  margin-bottom: 20px;
}

/* 用户信息框 | 头像 | 用户名 */
/* 头部头像 */
.setting_drawer .avatar_nickname_c > .nickname_c {
  padding-left: 10px;
  cursor: pointer;
}

/* nickname */
.setting_drawer .avatar_nickname_c > .nickname_c > .nickname {
  font-weight: 500;
  font-size: 14px;
}

/* 修改群信息 */
.setting_drawer .avatar_nickname_c > .nickname_c > .nickname_action {
  color: var(--im-theme-primary);
}

/* svg */
.setting_drawer .avatar_nickname_c > svg {
  position: absolute;
  right: 15px;
}

/* 群成员部分 */
.setting_drawer .group_c {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* 群成员头部 */
.setting_drawer .group_c > .top_c {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
/* title */
.setting_drawer .title {
  font-size: 14px;
  font-weight: 500;
}
/* num */
.setting_drawer .group_c > .top_c > .right_number_icon {
  display: flex;
  align-items: center;
}

/* 成员 */
.setting_drawer .group_c > .member_a_c {
  position: relative;
  margin-top: 10px;
}
/* 头像列表 */
.setting_drawer .group_c > .member_a_c > .avatar_item {
  position: relative;
  display: inline-flex;
}
.setting_drawer .group_c > .member_a_c > .avatar_item > .a_reduce_icon {
  position: absolute;
  right: 0;
  top: -10px;
  z-index: 5;
}
/* icon */
.setting_drawer .group_c > .member_a_c > .group_icon {
  position: relative;
  width: 40px;
  height: 45px;
  cursor: pointer;
}

/* 群备注 */
.setting_drawer .g_remark_c {
  display: flex;
  justify-content: space-between;
  height: 56px;
}
/* 右部分 */
.setting_drawer .g_remark_c .right_remark {
  width: 130px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.setting_drawer .g_remark_c .right_remark > .remark {
  margin-right: 5px;
}

/* 成员抽屉样式 */
.setting_drawer .group_list_item {
  justify-content: space-between;
  align-items: center;
  color: var(--color-text);
}
.setting_drawer .group_list_item:first-child {
  margin-top: 20px;
}

.setting_drawer .group_list_item > .left_info {
  display: flex;
}
.setting_drawer .group_list_item > .left_info > div {
  padding-left: 10px;
}
.setting_drawer .group_list_item > .right_icon > svg:first-child {
  margin-right: 10px;
}

/* 编辑群信息 */
.setting_drawer .group_edit_item {
  justify-content: space-between;
  align-items: center;
}
.setting_drawer .group_edit_item > .right_remark {
  display: flex;
  align-items: center;
}
</style>

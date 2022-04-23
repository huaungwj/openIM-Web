<template>
  <n-drawer
    class="setting_drawer"
    :show="drawerStatus !== 'cancel'"
    :width="360"
    placement="right"
    :on-mask-click="cancelOutDrawer"
    :on-esc="cancelOutDrawer"
  >
    <n-drawer-content title="设置" v-if="drawerStatus === 'setting'">
      <!-- {{ contactsStore.groupInfo }} -->
      <!-- 头像名称部分 -->
      <div class="drawer_item avatar_nickname_c">
        <MyAvatar
          :src="
            isSingleCve(cveStore.curCve)
              ? friendInfo?.faceURL
              : contactsStore.groupInfo.faceURL
          "
          :size="50"
        />
        <div class="nickname_c">
          <span class="nickname" @click="showDeInfoFun">{{
            isSingleCve(cveStore.curCve)
              ? friendInfo.nickname
              : contactsStore.groupInfo.groupName
          }}</span>
          <p v-if="!isSingleCve(cveStore.curCve)" class="nickname_action">
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
            <span>4</span>
            <svg
              class="icon"
              aria-hidden="true"
              style="cursor: pointer"
              @click="innerDrawerStatus = 'groupList'"
            >
              <use xlink:href="#openIM-arrow-right"></use>
            </svg>
          </span>
        </div>
        <!-- memberList -->
        <div class="member_a_c">
          <my-avatar
            style="margin-right: 10px"
            v-for="member in contactsStore.groupMemberList.slice(0, 4)"
            :key="member.userID"
            :src="member.faceURL"
            :size="40"
          />
          <svg class="icon group_icon" @click="addFriendFun" aria-hidden="true">
            <use xlink:href="#openIM-add1"></use></svg
          ><svg
            class="icon group_icon"
            style="color: #ec6a5e"
            aria-hidden="true"
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
            <span class="remark">e556230f35dee52f5d124980eb49c906</span>
          </div>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#openIM-fuzhi"></use>
          </svg>
        </div>
      </div>
      <!-- 置顶 -->
      <div class="drawer_item g_remark_c">
        <span class="title">置顶</span>
        <n-switch :value="true" />
      </div>
      <!-- 添加到黑名单 -->
      <div class="drawer_item g_remark_c" v-if="isSingleCve(cveStore.curCve)">
        <span class="title">添加到黑名单</span>
        <n-switch :value="true" />
      </div>
      <!-- 免打扰 -->
      <div class="drawer_item g_remark_c">
        <span class="title">免打扰</span>
        <n-switch :value="true" />
      </div>
      <!-- 按钮组 -->
      <div class="g_remark_c" style="justify-content: space-around">
        <n-button strong secondary type="primary"> 退出群聊 </n-button>
        <n-button tertiary type="error"> 解散群聊 </n-button>
      </div>
    </n-drawer-content>
    <n-drawer-content title="群公告" v-if="drawerStatus === 'groupNotice'">
      群公告
    </n-drawer-content>

    <!-- 第二个模态框 - 群成员 -->

    <n-drawer
      class="setting_drawer"
      v-model:show="innerDrawerStatus"
      :width="360"
      placement="right"
    >
      <n-drawer-content title="斯通纳">
        《斯通纳》是美国作家约翰·威廉姆斯在 1965 年出版的小说。
      </n-drawer-content>
    </n-drawer>
  </n-drawer>
</template>

<script lang="ts" setup>
import { ref, onMounted, toRefs, watch } from 'vue';
import MyAvatar from '@/components/myAvatar/MyAvatar.vue';
import Bus from '@/tools/bus';
import { useContactsStore } from '@/stores/contacts';
import { useCveStore } from '@/stores/cve';
import { useCommonStore } from '@/stores/common';
import { isSingleCve } from '@/tools';
import type { FriendItem } from '@/tools/im/types';

const drawerStatus = ref<string | boolean>('cancel');
const innerDrawerStatus = ref<boolean>(false);
const cveStore = useCveStore();
const contactsStore = useContactsStore();
const commonStore = useCommonStore();
const friendInfo = ref<FriendItem>();

const cancelOutDrawer = () => {
  drawerStatus.value = 'cancel';
};
const cancelInnerDrawer = () => {
  drawerStatus.value = 'cancel';
};

const initFriendInfo = () => {
  if (contactsStore.friendList.length === 0) return;
  friendInfo.value = contactsStore.friendList.filter(
    (item: FriendItem) => cveStore.curCve.userID === item.userID
  )[0];
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

watch(
  () => cveStore.curCve,
  () => {
    initFriendInfo();
  }
);
watch(
  () => innerDrawerStatus.value,
  () => {
    if (innerDrawerStatus.value === 'cancel') {
      innerDrawerStatus.value = false;
    } else if (typeof innerDrawerStatus.value === 'string') {
      innerDrawerStatus.value = true;
    }
  }
);

onMounted(() => {
  Bus.$on('SETDRAWERSTATUS', (status: string) => {
    drawerStatus.value = status;
  });
  initFriendInfo();
});
</script>

<style>
.setting_drawer .drawer_item {
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
</style>

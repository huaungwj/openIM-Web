<template>
  <div class="c_g_A_r_m_c">
    <n-modal
      :show="commonStore.createGARelayMTpye !== 'cancel'"
      class="create_g_a_r_modal"
      transform-origin="center"
    >
      <n-card
        style="width: 600px"
        :bordered="false"
        content-style="padding: 0; border-radius: 20px"
        size="huge"
        role="dialog"
        aria-modal="true"
        :on-esc="cancelModalFun"
      >
        <div class="c_g_modal_card_container">
          <n-scrollbar style="width: 42%; padding-top: 50px">
            <div class="c_g_modal_card_left_c" ref="leftFriContainer">
              <!-- 头部搜索框 -->
              <div class="serch_input_c">
                <n-input
                  v-model:value="searchInputValue"
                  size="small"
                  :placeholder="t('search')"
                >
                  <template #prefix>
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#openIM-search"></use>
                    </svg> </template
                ></n-input>
              </div>
              <!-- 列表 -->
              <!-- {{ consList }} -->
              <div
                class="c_g_m_f_a_g_list"
                v-for="con in memberList"
                :key="
                  con.initial
                    ? con.initial
                    : con.userID
                    ? con.userID
                    : con.groupID
                "
              >
                <p class="">{{ con.initial && con.initial }}</p>
                <div v-if="con.data?.length > 0">
                  <FriendAGroupItem
                    v-for="item in con.data"
                    :key="item.userID"
                    :data="item"
                    type="friend"
                    :ChangeCheckedArr="ChangeCheckedArr"
                  />
                </div>
                <FriendAGroupItem
                  v-else
                  :data="con"
                  type="group"
                  :ChangeCheckedArr="ChangeCheckedArr"
                />
              </div>
            </div>
          </n-scrollbar>
          <div class="c_g_modal_card_right_c">
            <div>
              <div class="top_c">
                <span class="title">{{
                  commonStore.createGARelayMTpye === 'createGroup'
                    ? t('initGroupChat')
                    : t('sendTo')
                }}</span
                ><span class="num">{{
                  t('selected') + selectArr.length + t('aFriend')
                }}</span>
              </div>
              <!-- 朋友展示区 -->
              <n-scrollbar>
                <div class="friend_list">
                  <div
                    class="friend_item"
                    v-for="item in selectArr"
                    :key="item.userID"
                  >
                    <MyAvatar :src="item.faceURL" :size="55" />

                    <span
                      style="
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                      "
                      >{{
                        item.nickname ? item.nickname : item.groupName
                      }}</span
                    >
                  </div>
                </div>
              </n-scrollbar>
            </div>
            <div class="c_g_modal_footer">
              <div v-if="commonStore.createGARelayMTpye === 'createGroup'">
                <n-input
                  :placeholder="t('pleaseGroupName')"
                  v-model:value="cGroupName"
                  autofocus
                />
                <div class="group_avatar_upload">
                  <my-avatar :src="cGroupFaceURL" :size="40" />
                  <n-upload
                    ref="uploadGroupImageRef"
                    :show-file-list="false"
                    :custom-request="customUpload"
                    accept=".gif,.jpeg,.jpg,.png"
                  >
                    <a
                      style="
                        color: var(--im-theme-primary);
                        padding-left: 10px;
                        line-height: 34px;
                      "
                      >{{ t('click') + t('upload') }}</a
                    >
                  </n-upload>
                </div>
              </div>
              <div
                v-if="
                  ['forwardMsg', 'mergeForwardMsg'].includes(
                    commonStore.createGARelayMTpye
                  )
                "
                class="forward_msg_c"
                @click="preViewForWardMsgFun"
              >
                {{
                  commonStore.createGARelayMTpye === 'forwardMsg'
                    ? `[${t('articleItem') + t('forward')}]`
                    : `[${t('merge') + t('forward')}]`
                }}
                {{ t('groupChat') + t('chatRecord') }}
              </div>
              <div class="button_group">
                <n-button
                  style="width: 40%"
                  strong
                  secondary
                  @click="cancelModalFun"
                  >{{ t('cancel') }}</n-button
                >
                <n-button
                  style="width: 40%"
                  type="primary"
                  @click="switchActionFun"
                  >{{
                    commonStore.createGARelayMTpye === 'createGroup'
                      ? t('create')
                      : t('send')
                  }}</n-button
                >
              </div>
            </div>
          </div>
        </div>
      </n-card>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useCommonStore } from '@/stores/common';
import { useFriend } from '@/hooks/useFriend';
import FriendAGroupItem from '@/components/CreateGARelayM/components/FriendAGroupItem.vue';
import { useContactsStore } from '@/stores/contacts';
import { useMessage } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import type {
  FriendItem,
  GroupInitInfo,
  Member,
  CreateGroupParams,
  MessageItem,
  GroupItem,
  InviteGroupParams,
} from '@/tools/im/types';
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import MyAvatar from '../myAvatar/MyAvatar.vue';
import { getCosAuthorization, cosUpload } from '@/tools/cos';
import { fileSizeTran } from '@/tools/tools';
import { im } from '@/tools';
import Bus from '@/tools/bus';
import { messageTypes } from '@/tools/im/constants/messageContentType';
import { useCveStore } from '@/stores/cve';
import type { UploadInst } from 'naive-ui';

type Cons = {
  data: FriendItem[];
  initial: string;
};

// use
const commonStore = useCommonStore();
const contactsStore = useContactsStore();
const { t } = useI18n();
const cveStore = useCveStore();
const message = useMessage();
const { consList } = useFriend();
const selectArr = ref<FriendItem[] & GroupItem[]>([]);
const searchInputValue = ref<string>('');
const leftFriContainer = ref<HTMLElement>(null as unknown as HTMLElement);
const cGroupName = ref<string>('');
const cGroupFaceURL = ref<string>(`ic_avatar_0${Math.ceil(Math.random() * 9)}`);
const uploadGroupImageRef = ref<UploadInst | null>(null);
const mutilMsgArr = ref<MessageItem[]>();
const memberList = ref<(FriendItem[] & GroupItem[]) & Cons[]>();
const optionTitle = ref<string>();
const optionSummaryList = ref<string[]>([]);

// 取消按钮回调
const cancelModalFun = () => {
  commonStore.setcreateGARelayMTpye('cancel');
  initStatus();
};

// 初始化状态
const initStatus = () => {
  selectArr.value = [];
  cGroupName.value = '';
  cGroupFaceURL.value = `ic_avatar_0${Math.ceil(Math.random() * 9)}`;
};

/**
 * 更改复选框选择
 * @param type add | remove
 * @param userID
 */
const ChangeCheckedArr = (type: string, member: FriendItem & GroupItem) => {
  // 朋友
  if (type === 'add') {
    selectArr.value.push(member);
  } else {
    // item.userID !== tmp[0].userID
    selectArr.value = selectArr.value.filter((item: FriendItem & GroupItem) => {
      if (item.userID) {
        return item.userID !== member.userID;
      } else {
        return item.groupID !== member.groupID;
      }
    });
  }

  console.log(selectArr.value);
};

// 创建群聊
const createGroupFun = () => {
  if (!cGroupName.value.trim()) return message.warning(t('pleaseGroupName'));
  if (!cGroupFaceURL.value.trim())
    return message.warning(t('place') + t('upload') + t('cve.groupAvatar'));
  if (selectArr.value.length < 0)
    return message.warning(t('place') + t('select') + t('friend'));
  const groupBaseInfo: GroupInitInfo = {
    groupType: 0,
    groupName: cGroupName.value,
    introduction: '',
    notification: '',
    faceURL: cGroupFaceURL.value,
    ex: '',
  };
  const memberList: Member[] = [];
  selectArr.value.forEach((s) => {
    memberList.push({
      userID: (s as FriendItem).userID,
      roleLevel: 1,
    });
  });
  const options: CreateGroupParams = {
    groupBaseInfo,
    memberList,
  };
  // 创建群聊
  im.createGroup(options)
    .then(({ data }) => {
      message.success(t('suc') + t('create') + t('groupChat'));
      // 关闭模态框
      commonStore.setcreateGARelayMTpye('cancel');
    })
    .catch((err) => {
      message.error(t('create') + t('groupChat') + t('fail'));
    });
  initStatus();
};

// 自定义上传
const customUpload = async (data: UploadRequestOption) => {
  if (!data) return false;
  if (data.file.file.size > 2097152) {
    // 清空，不清空会存在上传多个
    uploadGroupImageRef.value?.clear();
    return message.warning(
      `${t('cur') + t('file') + t('size')}：${fileSizeTran(
        data.file.file.size
      )}${t('avatar') + t('file') + t('notGreater')}2MB`
    );
  }
  await getCosAuthorization();
  cosUpload(data.file)
    .then((res) => {
      console.log(res);
      cGroupFaceURL.value = res.url;
      uploadGroupImageRef.value?.clear();
    })
    .catch((err) => {
      console.log(err);
    });
};

// 查看需要转发的信息
const preViewForWardMsgFun = () => {
  Bus.$emit('PREVIEWMERGEMSG', {
    type: true,
    mutilMsgArrTmp: mutilMsgArr.value,
  });
};

// 按钮进行最后的操作 createGroupFun
const switchActionFun = () => {
  const type = commonStore.createGARelayMTpye;
  switch (type) {
    case 'createGroup':
      createGroupFun();
      break;
    // 合并转发
    case 'mergeForwardMsg':
      if (selectArr.value.length === 0 || selectArr.value.length > 1)
        return message.error(t('selectOnly'));
      Bus.$emit('SENDFORWARDMSG', {
        options: {
          title: optionTitle.value,
          summaryList: optionSummaryList.value,
          messageList: mutilMsgArr.value,
        },
        type: messageTypes.MERGERMESSAGE,
        list: selectArr.value,
      });
      cancelModalFun();
      break;
    // 逐条转发
    case 'forwardMsg':
      if (selectArr.value.length === 0 || selectArr.value.length > 1)
        return message.error(t('selectOnly'));
      mutilMsgArr.value?.forEach((item) => {
        Bus.$emit('SENDFORWARDMSG', {
          options: item,
          type: item.contentType,
          list: selectArr.value,
        });
      });
      cancelModalFun();
      break;
    // 发送名片
    case 'sendCard':
      // console.log('执行了', selectArr.value);
      selectArr.value?.forEach((item: FriendItem) => {
        Bus.$emit('SENDCARDMSG', item);
      });
      cancelModalFun();
      break;

    case 'addGroupMember': {
      if (selectArr.value.length === 0)
        return message.error(t('place') + t('select') + t('friend'));
      // console.log('添加新成员', selectArr.value);
      const options: InviteGroupParams = {
        groupID: cveStore.curCve.groupID,
        reason: '',
        userIDList: selectArr.value.map((item: FriendItem) => item.userID),
      };
      im.inviteUserToGroup(options)
        .then((res) => message.success(t('sendSuc')))
        .catch((err) => message.error(t('actionErrorText')));
      // 新成员添加
      contactsStore.setGroupMemberList([
        ...contactsStore.groupMemberList,
        ...selectArr.value,
      ]);
      cancelModalFun();

      Bus.$emit('SETDRAWERSTATUS', 'cancel');
      break;
    }

    default:
      break;
  }
};

onMounted(() => {
  Bus.$on(
    'FORWARDMSG',
    ({
      messageList,
      title,
      summaryList,
    }: {
      messageList: MessageItem[];
      title?: string;
      summaryList: string[];
    }) => {
      mutilMsgArr.value = messageList;
      console.log(messageList);
      if (title) {
        optionTitle.value = title;
        optionSummaryList.value = summaryList;
      }
    }
  );
});

watch(
  () => commonStore.createGARelayMTpye,
  () => {
    if (commonStore.createGARelayMTpye === 'cancel') return;

    if (
      ['addGroupMember', 'createGroup', 'sendCard'].includes(
        commonStore.createGARelayMTpye
      )
    ) {
      memberList.value = consList.value;
    } else if (
      ['forwardMsg', 'mergeForwardMsg'].includes(commonStore.createGARelayMTpye)
    ) {
      // contactsStore.friendList
      // contactsStore.groupList
      const tmp = []
        .concat(contactsStore.friendList)
        .concat(contactsStore.groupList);
      memberList.value = tmp;
    }

    console.log(memberList.value);
  }
);
</script>

<style>
.c_g_modal_card_container {
  display: flex;
  height: 400px;
  border-radius: 15px;
  background-color: var(--im-theme-topSearchBg);
}
/* 左边列表盒子 */
.c_g_modal_card_container .c_g_modal_card_left_c {
  position: relative;
  padding: 15px;
}
.c_g_modal_card_container .c_g_modal_card_left_c .serch_input_c {
  position: fixed;
  background-color: var(--im-theme-topSearchBg);
  margin-top: -53px;
}

/* 右边盒子 */
.c_g_modal_card_container > .c_g_modal_card_right_c {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 58%;
  background-color: var(--im--theme-CGModalBg);
  padding: 20px 25px 20px 20px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
}
/* 头部 */
.c_g_modal_card_container > .c_g_modal_card_right_c .top_c {
  display: flex;
  justify-content: space-between;
}

.c_g_modal_card_container > .c_g_modal_card_right_c .top_c > .title {
  font-weight: 500;
}
.c_g_modal_card_container > .c_g_modal_card_right_c .top_c > .num {
  font-size: 12px;
  color: var(--color-text);
}
/* 右边朋友显示列表 */
.c_g_modal_card_container > .c_g_modal_card_right_c .friend_list {
  display: flex;
}
/* 脚部 */
.c_g_modal_card_container > .c_g_modal_card_right_c > .c_g_modal_footer {
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
/* 底部操作按钮组 */
.c_g_modal_card_container
  > .c_g_modal_card_right_c
  > .c_g_modal_footer
  > .button_group {
  display: flex;
  justify-content: center;
  margin: 20px 0 10px 0;
}
/* 上传 */
.c_g_modal_card_container
  > .c_g_modal_card_right_c
  > .c_g_modal_footer
  .group_avatar_upload {
  display: flex;
  padding-top: 20px;
}
/* 底部每个按钮 */
.c_g_modal_card_container > .c_g_modal_card_right_c > .c_g_modal_footer button {
  margin-right: 10px;
}

/* 群组聊天内容 */
.c_g_modal_card_container
  > .c_g_modal_card_right_c
  > .c_g_modal_footer
  .forward_msg_c {
  width: 100%;
  background-color: var(--im-theme-chatMsgBg);
  padding: 10px;
  cursor: pointer;
  color: var(--color-text);
  border-radius: 8px;
}

.c_g_modal_card_container
  > .c_g_modal_card_right_c
  .friend_list
  > .friend_item {
  display: flex;
  flex-direction: column;
  padding: 10px 20px 20px 0;
  width: 75px;
  text-align: center;
}
.c_g_modal_card_container
  > .c_g_modal_card_right_c
  .friend_list
  > .friend_item
  > span:nth-child(2) {
  padding-top: 7px;
}
.create_g_a_r_modal {
  background-color: transparent !important;
}
</style>

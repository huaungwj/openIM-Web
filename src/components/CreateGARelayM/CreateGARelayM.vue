<template>
  <div class="c_g_A_r_m_c">
    <n-modal
      :show="commonStore.createGARelayMTpye === 'show'"
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
                  placeholder="搜索"
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
                v-for="con in consList"
                :key="con.initial"
              >
                <p class="">{{ con.initial }}</p>
                <FriendAGroupItem
                  v-for="item in con.data"
                  :key="item.userID"
                  :data="item"
                  type="friend"
                  :ChangeCheckedArr="ChangeCheckedArr"
                />
              </div>
            </div>
          </n-scrollbar>
          <div class="c_g_modal_card_right_c">
            <div>
              <div class="top_c">
                <span class="title">发起群聊</span
                ><span class="num">已选择{{ selectArr.length }}个朋友</span>
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
                      >{{ item.nickname }}</span
                    >
                  </div>
                </div>
              </n-scrollbar>
            </div>
            <div class="c_g_modal_footer">
              <n-input
                placeholder="请输入群名称"
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
                    >点击上传</a
                  >
                </n-upload>
              </div>
              <div class="button_group">
                <n-button
                  style="width: 40%"
                  strong
                  secondary
                  @click="cancelModalFun"
                  >取消</n-button
                >
                <n-button
                  style="width: 40%"
                  type="primary"
                  @click="createGroupFun"
                  >创建</n-button
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
import { ref } from 'vue';
import { useCommonStore } from '@/stores/common';
import { useFriend } from '@/hooks/useFriend';
import FriendAGroupItem from '@/components/CreateGARelayM/components/FriendAGroupItem.vue';
import { useContactsStore } from '@/stores/contacts';
import { useMessage } from 'naive-ui';
import type {
  FriendItem,
  GroupInitInfo,
  Member,
  CreateGroupParams,
} from '@/tools/im/types';
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import MyAvatar from '../myAvatar/MyAvatar.vue';
import { getCosAuthorization, cosUpload } from '../../tools/cos';
import { fileSizeTran } from '../../tools/tools';
import { da } from 'date-fns/locale';
import { im } from '../../tools';

// use
const commonStore = useCommonStore();
const contactsStore = useContactsStore();
const message = useMessage();
const { sections, consList, regionActive, initFriendList } = useFriend();
const selectArr = ref<FriendItem[]>([]);
const searchInputValue = ref<string>('');
const leftFriContainer = ref<HTMLElement>(null as unknown as HTMLElement);
const cGroupName = ref<string>('');
const cGroupFaceURL = ref<string>(`ic_avatar_0${Math.ceil(Math.random() * 9)}`);
const uploadGroupImageRef = ref<HTMLElement>(null as unknown as HTMLElement);

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
const ChangeCheckedArr = (type: string, userID: string) => {
  let tmp = contactsStore.friendList.filter(
    (item: FriendItem) => item.userID === userID
  );
  if (type === 'add' && tmp.length > 0) {
    selectArr.value.push(tmp[0]);
  } else {
    selectArr.value = selectArr.value.filter(
      (item: FriendItem) => item.userID !== tmp[0].userID
    );
  }
  console.log(selectArr.value);
};

// 创建群聊
const createGroupFun = () => {
  if (!cGroupName.value.trim()) return message.warning('请输入群名称再继续');
  if (!cGroupFaceURL.value.trim()) return message.warning('请上传群头像再继续');
  if (selectArr.value.length < 0) return message.warning('请选择朋友在继续');
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
      message.success('成功创建群聊！');
      // 关闭模态框
      commonStore.setcreateGARelayMTpye('cancel');
    })
    .catch((err) => {
      message.error('创建群聊失败！');
    });
  initStatus();
};

// 自定义上传
const customUpload = async (data: UploadRequestOption) => {
  if (!data) return false;
  console.log(data);
  if (data.file.file.size! > 2097152) {
    // 清空，不清空会存在上传多个
    uploadGroupImageRef.value.clear();
    return message.warning(
      `当前文件大小为：${fileSizeTran(data.file.file.size)}头像文件不能大于2MB`
    );
  }
  await getCosAuthorization();
  cosUpload(data.file)
    .then((res) => {
      console.log(res);
      cGroupFaceURL.value = res.url;
      uploadGroupImageRef.value.clear();
    })
    .catch((err) => {
      console.log(err);
    });
};
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
  justify-content: space-between;
}
.c_g_modal_card_container
  > .c_g_modal_card_right_c
  > .c_g_modal_footer
  > .button_group {
  display: flex;
  justify-content: center;
}
.c_g_modal_card_container
  > .c_g_modal_card_right_c
  > .c_g_modal_footer
  > .group_avatar_upload {
  display: flex;
}
.c_g_modal_card_container > .c_g_modal_card_right_c > .c_g_modal_footer button {
  margin-right: 10px;
}
.c_g_modal_card_container
  > .c_g_modal_card_right_c
  .friend_list
  > .friend_item {
  display: flex;
  flex-direction: column;
  padding: 10px 20px 20px 0;
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

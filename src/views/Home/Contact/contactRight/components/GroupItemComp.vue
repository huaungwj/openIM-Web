<template>
  <div class="group_item_c">
    <!-- 头像，群聊信息 -->
    <div class="group_info_c">
      <my-avatar :src="item.faceURL" :size="60" />
      <div class="group_info">
        <p class="group_name">
          <span>{{ item.groupName }}</span>
          <svg
            class="icon"
            aria-hidden="true"
            style="width: 18px; height: 18px"
          >
            <use xlink:href="#openIM-zhanghuxinxi"></use>
          </svg>
        </p>
        <!-- 创建人 -->
        <p class="create_user_id">
          创建人ID：
          <n-tooltip trigger="hover">
            <template #trigger>
              <svg
                class="icon"
                @click="copyFun(item.creatorUserID)"
                aria-hidden="true"
                style="cursor: pointer; width: 15px; height: 15px"
              >
                <use xlink:href="#openIM-fuzhi"></use>
              </svg>
            </template>
            {{ item.creatorUserID }}
          </n-tooltip>
        </p>
        <!-- 群ID -->
        <p class="group_id">
          群聊ID：
          <n-tooltip trigger="hover">
            <template #trigger>
              <svg
                class="icon"
                aria-hidden="true"
                style="cursor: pointer; width: 15px; height: 15px"
                @click="copyFun(item.groupID)"
              >
                <use xlink:href="#openIM-fuzhi"></use>
              </svg>
            </template>
            {{ item.groupID }}
          </n-tooltip>
        </p>
      </div>
    </div>
    <!-- to_group_chat -->
    <div class="to_chat" @click="goChatFun(item.groupID, SessionType.GROUPCVE)">
      <svg
        class="icon"
        aria-hidden="true"
        style="width: 40px; height: 40px; cursor: pointer"
      >
        <use xlink:href="#openIM-message3"></use>
      </svg>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import type { GroupItem } from '@/stores/types/contacts';
import MyAvatar from '@/components/myAvatar/MyAvatar.vue';
import { SessionType } from '@/tools/im/constants/messageContentType';
import { useCopy } from '@/hooks/useCopy';

const props = defineProps<{
  item: GroupItem;
  goChatFun: (id: string, type: SessionType) => void;
}>();

//use
const { copyFun } = useCopy();

console.log(props.item);
</script>

<style>
.group_item_c {
  width: 351px;
  height: 150px;
  border-radius: 10px;
  padding: 40px 30px;
  margin: 0 23px 30px 0px;
  background-color: var(--im-theme-cveItemBg);
  box-shadow: 0px 0px 10.9px rgba(0, 0, 0, 0.14),
    0px 0px 101px rgba(0, 0, 0, 0.02);
  display: flex;
  justify-content: space-between;
}

/* 左边群聊信息和头像 */
.group_item_c > .group_info_c {
  display: flex;
}

/* 群聊信息 */
.group_item_c > .group_info_c > .group_info {
  padding-left: 15px;
  font-size: 12px;
  color: var(--color-text);
}
.group_item_c > .group_info_c > .group_info > .group_name > span {
  font-size: 16px;
  font-weight: 500;
  padding-right: 5px;
  color: var(--color-heading);
}

.group_item_c .create_user_id {
  padding: 5px 0;
}

@media (prefers-color-scheme: dark) {
  .group_item_c {
    box-shadow: 0px 0px 10.9px rgba(255, 255, 255, 0.14),
      0px 0px 101px rgba(255, 255, 255, 0.02);
  }
}
</style>

<template>
  <div
    :class="`c_g_m_f_a_g_item ${isChecked && 'active_c_g'} ${
      groupMemberListID.some((item) => data.userID === item) &&
      commonStore.createGARelayMTpye === 'addGroupMember' &&
      'disabled'
    }`"
    @click="selectItem"
  >
    <n-checkbox
      v-model:checked="isChecked"
      :disabled="
        groupMemberListID.some((item) => data.userID === item) &&
        commonStore.createGARelayMTpye === 'addGroupMember'
      "
      @click="selectItem"
    >
    </n-checkbox>
    <MyAvatar class="face_url" :src="data.faceURL" :size="33" />
    <span class="show_name"
      >{{ data.nickname ? data.nickname : data.groupName }}
      <n-tag type="info" v-if="data.groupName">
        {{ $t('groupChat') }}
      </n-tag></span
    >
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, watch, onMounted } from 'vue';
import type { FriendItem, GroupItem, GroupMemberItem } from '@/tools/im/types';
import MyAvatar from '@/components/myAvatar/MyAvatar.vue';
import { useCommonStore } from '@/stores/common';
import { useContactsStore } from '@/stores/contacts';

const props = defineProps<{
  type: string;
  data: FriendItem & GroupItem;
  ChangeCheckedArr: (type: string, member: FriendItem & GroupItem) => void;
}>();
const contactsStore = useContactsStore();
const commonStore = useCommonStore();
const groupMemberListID = ref<string[]>([]);
const isChecked = ref<boolean>(false);

const selectItem = () => {
  if (
    groupMemberListID.value.some((item) => props.data.userID === item) &&
    commonStore.createGARelayMTpye === 'addGroupMember'
  )
    return;
  isChecked.value = !isChecked.value;
};

const resetGroupMListID = () => {
  groupMemberListID.value = contactsStore.groupMemberList.map(
    (member: GroupMemberItem) => {
      return member.userID;
    }
  );
};

watch(
  () => isChecked.value,
  () => {
    if (
      groupMemberListID.value.some((item) => props.data.userID === item) &&
      commonStore.createGARelayMTpye === 'addGroupMember'
    )
      return;
    if (isChecked.value) {
      props.ChangeCheckedArr('add', props.data);
    } else {
      props.ChangeCheckedArr('remove', props.data);
    }
  }
);

watch(
  () => contactsStore.groupMemberList,
  () => {
    resetGroupMListID();
  }
);

onMounted(() => {
  resetGroupMListID();
});
</script>

<style>
.c_g_m_f_a_g_item {
  display: flex;
  width: 100%;
  align-items: flex-start;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  margin-bottom: 10px;
  border-radius: 12px;
}

.active_c_g {
  background: var(--im-theme-activeCveBg);
}

.c_g_m_f_a_g_item > .face_url {
  margin-left: 15px;
}

.c_g_m_f_a_g_item > .show_name {
  padding-left: 20px;
}

.disabled {
  cursor: not-allowed;
}
</style>

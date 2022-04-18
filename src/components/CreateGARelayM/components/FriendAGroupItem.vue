<template>
  <div
    :class="`c_g_m_f_a_g_item ${isChecked && 'active_c_g'}`"
    @click="selectItem"
  >
    <n-checkbox v-model:checked="isChecked"> </n-checkbox>
    <MyAvatar class="face_url" :src="data.faceURL" :size="33" />
    <span class="show_name">{{
      type === 'friend' ? data.nickname : data.groupName
    }}</span>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, watch } from 'vue';
import type { FriendItem, GroupItem } from '@/tools/im/types';
import MyAvatar from '@/components/myAvatar/MyAvatar.vue';

const props = defineProps<{
  type: string;
  data: FriendItem & GroupItem;
  ChangeCheckedArr: (type: string, userID: string) => void;
}>();

const isChecked = ref<boolean>(false);

const selectItem = () => {
  isChecked.value = !isChecked.value;
};

watch(
  () => isChecked.value,
  () => {
    if (isChecked.value) {
      props.ChangeCheckedArr('add', props.data.userID);
    } else {
      props.ChangeCheckedArr('remove', props.data.userID);
    }
  }
);
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
</style>

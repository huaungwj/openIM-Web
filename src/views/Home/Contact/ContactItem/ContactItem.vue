<template>
  <div
    :class="`contact_item_c ${contactsStore.conPage === page && 'active'}`"
    @click="contactsStore.togglePage(page)"
  >
    <div class="left">
      <svg class="icon contact_icon" aria-hidden="true">
        <use :xlink:href="`#openIM-${icon}`"></use>
      </svg>
      <span>{{ text }}</span>
    </div>
    <span>{{ num }}</span>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from 'vue';
import { useContactsStore } from '@/stores/contacts';
import type {
  FriendApplicationItem,
  GroupApplicationItem,
} from '@/tools/im/types';

const contactsStore = useContactsStore();
const props = defineProps<{
  text: string;
  icon: string;
  // num: number;
  page: string;
}>();
const num = ref<number>();

const initNum = () => {
  switch (props.page) {
    case 'tC':
    case 'mF': {
      return (num.value = contactsStore.friendList?.length);
    }

    case 'nF': {
      if (contactsStore.recvFriendApplicationList.length < 0)
        return (num.value = 0);
      const handleList = contactsStore.recvFriendApplicationList.filter(
        (item: FriendApplicationItem) => {
          if (item.handleResult !== 0) return;
          return item;
        }
      );

      return (num.value = handleList.length);
    }

    case 'nG': {
      if (contactsStore.recvGroupApplicationList.length < 0)
        return (num.value = 0);

      const handleList = contactsStore.recvGroupApplicationList.filter(
        (item: GroupApplicationItem) => {
          if (item.handleResult !== 0) return;
          return item;
        }
      );
      return (num.value = handleList.length);
    }

    case 'mG': {
      return (num.value = contactsStore.groupList.length);
    }
  }
};

initNum();
watch(
  [
    () => contactsStore.friendList,
    () => contactsStore.recvFriendApplicationList,
  ],
  () => {
    initNum();
  }
);
</script>

<style>
.contact_icon {
  width: 30px;
  height: 30px;
}

.contact_item_c {
  align-items: center;
}

.contact_item_c > .left {
  width: 35%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

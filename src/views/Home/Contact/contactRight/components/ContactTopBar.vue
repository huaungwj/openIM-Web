<template>
  <div class="contact_top_c">
    <span class="top_title">
      {{
        contactMenu.find((menu) => menu.key === contactsStore.conPage).text ||
        ''
      }}</span
    >
    <span
      class="top_select"
      v-if="['nF', 'nG'].some((item) => item === contactsStore.conPage)"
    >
      <n-select
        :placeholder="$t('place') + $t('select')"
        v-model:value="optionValue"
        :options="selectOptionFun()"
      />
    </span>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useContactsStore } from '@/stores/contacts';
import { useI18n } from 'vue-i18n';

type selectOptionType = {
  label: string;
  value: number | string;
  disabled?: boolean;
};

const contactsStore = useContactsStore();
const { t } = useI18n();
const optionValue = ref<number>(0);

const contactMenu = [
  { icon: 'drxx91', text: t('topContacts'), num: 10, key: 'tC' },
  { icon: 'a-bianzu61', text: t('newFriend'), num: 10, key: 'nF' },
  { icon: 'icon_1-09', text: t('newGroup'), num: 10, key: 'nG' },
  { icon: 'lianxiren', text: t('myFriend'), num: 10, key: 'mF' },
  { icon: 'a-bianzu38', text: t('myGroup'), num: 10, key: 'mG' },
  // { icon: 'heimingdanguanli', text: '黑名单', num: 10, key: 'bL' },
];

const selectOptionFun = () => {
  let option: selectOptionType[] = [];
  contactsStore.conPage === 'nF'
    ? (option = [
        { label: t('newFriend'), value: 0 },
        { label: t('myApplication'), value: 1 },
      ])
    : (option = [
        {
          label: t('groupEntryApp'),
          value: 0,
        },
        { label: t('myApplication'), value: 1 },
      ]);

  console.log(option);
  return option;
};

const initNewFGList = () => {
  switch (contactsStore.conPage) {
    case 'nF': {
      // 0 为新的好友
      return optionValue.value === 0
        ? contactsStore.setNewFGList({
            type: 'from',
            data: contactsStore.recvFriendApplicationList,
          })
        : contactsStore.setNewFGList({
            type: 'to',
            data: contactsStore.sentFriendApplicationList,
          });
    }
    case 'nG': {
      // 新的群
      return optionValue.value === 0
        ? contactsStore.setNewFGList({
            type: 'from',
            data: contactsStore.recvGroupApplicationList,
          })
        : contactsStore.setNewFGList({
            type: 'to',
            data: contactsStore.sentGroupApplicationList,
          });
    }
  }
};

watch(
  [
    () => optionValue.value,
    () => contactsStore.conPage,
    () => contactsStore.recvFriendApplicationList,
    () => contactsStore.sentFriendApplicationList,
    () => contactsStore.recvGroupApplicationList,
    () => contactsStore.sentGroupApplicationList,
  ],
  () => {
    initNewFGList();
  }
);
</script>

<style>
.top_select {
  width: 200px;
  margin-right: 40px;
}
</style>

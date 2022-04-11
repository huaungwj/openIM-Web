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
        placeholder="请选择"
        v-model:value="optionValue"
        :options="selectOptionFun()"
      />
    </span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useContactsStore } from '@/stores/contacts';
import { contactMenu } from '@/tools';

type selectOptionType = {
  label: string;
  value: number | string;
  disabled?: boolean;
};

const optionValue = ref<number>(0);

const selectOptionFun = () => {
  let option: selectOptionType[] = [];
  contactsStore.conPage === 'nF'
    ? (option = [
        { label: '新的好友', value: 0 },
        { label: '我的申请', value: 1 },
      ])
    : (option = [
        {
          label: '入群申请',
          value: 0,
        },
        { label: '我的申请', value: 1 },
      ]);

  console.log(option);
  return option;
};

const contactsStore = useContactsStore();
</script>

<style>
.top_select {
  width: 200px;
}
</style>

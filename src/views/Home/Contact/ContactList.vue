<template>
  <div class="contact_container">
    <TopSearch />
    <div class="contact_list">
      <ContactItem
        v-for="item in contactMenu"
        :key="item.key"
        :text="item.text"
        :icon="item.icon"
        :num="item.num"
        :page="item.key"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import TopSearch from '@/components/TopSearch/TopSearch.vue';
import ContactItem from '@/views/Home/Contact/ContactItem/ContactItem.vue';
// import { contactMenu } from '@/tools';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// contact 菜单
const contactMenu = [
  { icon: 'drxx91', text: t('topContacts'), num: 10, key: 'tC' },
  { icon: 'a-bianzu61', text: t('newFriend'), num: 10, key: 'nF' },
  { icon: 'icon_1-09', text: t('newGroup'), num: 10, key: 'nG' },
  { icon: 'lianxiren', text: t('myFriend'), num: 10, key: 'mF' },
  { icon: 'a-bianzu38', text: t('myGroup'), num: 10, key: 'mG' },
  // { icon: 'heimingdanguanli', text: '黑名单', num: 10, key: 'bL' },
];
</script>

<style>
.contact_list > .active {
  background-color: var(--im-theme-activeCveBg);
}
</style>

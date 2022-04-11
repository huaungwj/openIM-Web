<template>
  <div class="contact_r_c">
    <ContactTopBar />
    <!-- 常用联系人 和 我的好友 -->
    <main class="contact_main">
      <TCAMF
        v-if="contactsStore.conPage === 'tC' || contactsStore.conPage === 'mF'"
      />
      <!-- 新的好友 和 新的群组 -->
      <NewCG
        v-if="contactsStore.conPage === 'nF' || contactsStore.conPage === 'nG'"
      />
      <!-- 我的群组 -->
      <MG v-if="contactsStore.conPage === 'mG'" />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { useContactsStore } from '@/stores/contacts';
import NewCG from '@/views/Home/Contact/contactRight/NewCG.vue';
import TCAMF from '@/views/Home/Contact/contactRight/TCAMF.vue';
import MG from '@/views/Home/Contact/contactRight/MG.vue';
import ContactTopBar from '@/views/Home/Contact/contactRight/components/ContactTopBar.vue';

const contactsStore = useContactsStore();
</script>

<style>
.contact_r_c {
  width: calc(70vw - 10px);
}

.contact_r_c > .contact_main {
  padding: 60px 20px 230px 20px;
}
</style>

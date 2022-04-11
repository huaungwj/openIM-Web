<template>
  <div class="contact_container">
    <TopSearch />
    <div class="contactList">
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
import { ref } from 'vue';
import TopSearch from '@/components/TopSearch/TopSearch.vue';
import ContactItem from '@/views/Home/Contact/ContactItem/ContactItem.vue';
import { contactMenu } from '@/tools';
</script>

<style></style>

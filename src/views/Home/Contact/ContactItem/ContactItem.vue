<template>
  <div class="contact_item_c" @click="contactsStore.togglePage(page)">
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
import { defineProps } from 'vue';
import { useContactsStore } from '@/stores/contacts';

const contactsStore = useContactsStore();
const props = defineProps<{
  text: string;
  icon: string;
  num: number;
  page: string;
}>();
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

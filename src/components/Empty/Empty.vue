<template>
  <div class="empty_container">
    <slot name="header"></slot>

    <img class="empty_img" :src="imgSrc" />
    <slot name="footer"></slot>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
const props = defineProps<{ imgSrc: string }>();
</script>

<style>
.empty_container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.empty_container > .empty_img {
  width: 300px;
  height: 300px;
  padding-top: 30px;
}
</style>

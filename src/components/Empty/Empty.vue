<template>
  <div class="empty_container">
    <slot name="header"></slot>

    <img class="empty_img" :src="imgSrc" :width="width" :height="height" />
    <slot name="footer"></slot>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
const props = defineProps<{ imgSrc: string; width: number; height: number }>();
</script>

<style>
.empty_container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.empty_container > .empty_img {
  padding-top: 30px;
}
</style>

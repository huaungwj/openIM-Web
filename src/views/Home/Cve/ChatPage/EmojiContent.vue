<template>
  <div
    :style="{ boxShadow: '0px 4px 25px rgb(0 0 0 / 16%)' }"
    class="face_container"
  >
    <div
      v-for="face in faceMap"
      :key="face.context"
      @click="faceClick(face)"
      class="face_item"
    >
      <n-image preview-disabled="false" :width="24" :src="face.src" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { faceMap } from '@/tools/face';

const faceClick = (face) => {
  console.log(face);
};
</script>
<style></style>

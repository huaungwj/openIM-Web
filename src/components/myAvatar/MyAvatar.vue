<template>
  <n-avatar
    :size="size ? size : '42'"
    :src="localList[src] ? localList[src] : src"
    style="border-radius: 5px"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import ic_avatar_01 from '@/assets/images/ic_avatar_01.png';
import ic_avatar_02 from '@/assets/images/ic_avatar_02.png';
import ic_avatar_03 from '@/assets/images/ic_avatar_03.png';
import ic_avatar_04 from '@/assets/images/ic_avatar_04.png';
import ic_avatar_05 from '@/assets/images/ic_avatar_05.png';
import ic_avatar_06 from '@/assets/images/ic_avatar_06.png';
export default defineComponent({
  props: ['size', 'src'],
  setup(props, context) {
    const localList = reactive({
      ic_avatar_01,
      ic_avatar_02,
      ic_avatar_03,
      ic_avatar_04,
      ic_avatar_05,
      ic_avatar_06,
    });

    return {
      localList,
    };
  },
});
</script>

<style></style>

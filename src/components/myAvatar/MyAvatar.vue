<template>
  <n-avatar
    :size="size ? size : '42'"
    :src="localList[src] ? localList[src] : src"
    object-fit="cover"
  >
    <n-icon v-if="!src">
      <PersonOutline />
    </n-icon>
  </n-avatar>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import ic_avatar_01 from '@/assets/images/ic_avatar_01.png';
import ic_avatar_02 from '@/assets/images/ic_avatar_02.png';
import ic_avatar_03 from '@/assets/images/ic_avatar_03.png';
import ic_avatar_04 from '@/assets/images/ic_avatar_04.png';
import ic_avatar_05 from '@/assets/images/ic_avatar_05.png';
import ic_avatar_06 from '@/assets/images/ic_avatar_06.png';
import ic_avatar_07 from '@/assets/images/ic_avatar_07.png';
import ic_avatar_08 from '@/assets/images/ic_avatar_08.png';
import ic_avatar_09 from '@/assets/images/ic_avatar_09.png';
import ic_avatar_10 from '@/assets/images/ic_avatar_10.png';
import ic_avatar_11 from '@/assets/images/ic_avatar_11.png';
import { PersonOutline } from '@vicons/ionicons5';
export default defineComponent({
  components: {
    PersonOutline,
  },
  props: ['size', 'src'],
  setup(props, context) {
    const localList = reactive({
      ic_avatar_01,
      ic_avatar_02,
      ic_avatar_03,
      ic_avatar_04,
      ic_avatar_05,
      ic_avatar_06,
      ic_avatar_07,
      ic_avatar_08,
      ic_avatar_09,
      ic_avatar_10,
      ic_avatar_11,
    });

    return {
      localList,
      PersonOutline,
    };
  },
});
</script>

<style></style>

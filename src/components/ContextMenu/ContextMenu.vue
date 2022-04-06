<template>
  <ul
    v-show="menuData.visible"
    :style="{ left: menuData.left + 'px', top: menuData.top + 'px' }"
    class="contextmenu"
  >
    <slot name="menuItem"></slot>
  </ul>
</template>
<script lang="ts" setup>
import { defineProps, reactive, watch } from 'vue';

/**
 * type
 */
type offsetType = {
  offsetLeft: number;
  offsetWidth: number;
  clientX: number;
  clientY: number;
};

type MenuDataType = {
  left: number;
  top: number;
  visible: boolean;
};

const props = defineProps<{ offset: offsetType }>();

const menuData: MenuDataType = reactive({
  left: 0,
  top: 0,
  visible: false,
});

watch(
  () => props.offset,
  () => {
    const { offsetLeft, offsetWidth, clientX, clientY } = props.offset;
    const menuMinWidth = 105;
    const maxLeft = offsetWidth - menuMinWidth; // left boundary
    const left = clientX - offsetLeft + 15; // 15: margin right
    if (left > maxLeft) {
      menuData.left = maxLeft;
    } else {
      menuData.left = left;
    }
    menuData.top = clientY - 55;
    menuData.visible = true;
  },
  { deep: true }
);

const closeMenu = () => {
  menuData.visible = false;
};

watch(
  () => menuData.visible,
  (value: boolean) => {
    if (value) {
      document.body.addEventListener('click', closeMenu);
    } else {
      document.body.removeEventListener('click', closeMenu);
    }
  }
);
</script>
<style>
.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%),
    0 9px 28px 8px rgb(0 0 0 / 5%);
  /* box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3); */
  transition: all 0.5s;
}
.contextmenu li {
  list-style-type: none;
  margin: 0;
  padding: 7px 16px;
  cursor: pointer;
}
.contextmenu li:hover {
  background: #eee;
}
</style>

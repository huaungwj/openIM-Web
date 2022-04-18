import { reactive, ref } from 'vue';

export const useMenu = () => {
  const menuOffset = reactive({
    offsetLeft: 0,
    offsetWidth: 0,
    clientX: 0,
    clientY: 0,
  });
  const openMenu = (e: any, ERef: ref<HTMLElement>) => {
    menuOffset.offsetLeft = ERef.value.getBoundingClientRect().left; // container margin left
    menuOffset.offsetWidth = ERef.value.offsetWidth; // container width
    menuOffset.clientX = e.clientX;
    menuOffset.clientY =
      Math.abs(ERef.value.getBoundingClientRect().y) + e.clientY;
    return menuOffset;
  };

  return { openMenu };
};

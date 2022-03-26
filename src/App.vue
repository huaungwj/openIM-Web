<script lang="ts">
import { defineComponent, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { darkTheme } from 'naive-ui';
import { lightThemeOverrides, darkThemeOverrides } from './ui/theme';

// 是否是黑暗模式
let isDark: any = ref(
  window.matchMedia('(prefers-color-scheme: dark)').matches
);
/*模式切换听器*/
var listeners = {
  dark: function (mediaQueryList: any) {
    if (mediaQueryList.matches) {
      isDark.value = true;
    }
  },
  light: function (mediaQueryList: any) {
    if (mediaQueryList.matches) {
      isDark.value = false;
    }
  },
};
window.matchMedia('(prefers-color-scheme: dark)').addListener(listeners.dark);
window.matchMedia('(prefers-color-scheme: light)').addListener(listeners.light);

export default defineComponent({
  setup() {
    return {
      darkTheme,
      isDark,
      lightThemeOverrides,
      darkThemeOverrides,
    };
  },
});
</script>

<template>
  <!-- <header>
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/logo.svg"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->

  <n-config-provider
    :theme="isDark ? darkTheme : undefined"
    :theme-overrides="isDark ? darkThemeOverrides : lightThemeOverrides"
  >
    <NMessageProvider>
      <RouterView />
    </NMessageProvider>
  </n-config-provider>
</template>

<style>
@import '@/assets/base.css';
</style>

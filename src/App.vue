<script lang="ts">
import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';
import { darkTheme } from 'naive-ui';
import { lightThemeOverrides, darkThemeOverrides } from './ui/theme';

window.removeLoading();

// 是否是黑暗模式
export default defineComponent({
  setup() {
    return {
      darkTheme,
      lightThemeOverrides,
      RouterView,
      darkThemeOverrides,
    };
  },
});
</script>

<template>
  <n-config-provider
    :theme="$isDark.value ? darkTheme : undefined"
    :theme-overrides="$isDark.value ? darkThemeOverrides : lightThemeOverrides"
  >
    <NMessageProvider>
      <n-dialog-provider>
        <RouterView />
        <RouterView name="home" />
      </n-dialog-provider>
    </NMessageProvider>
  </n-config-provider>
</template>

<style>
@import '@/assets/base.css';
</style>

<template>
  <div class="user_setting_c">
    <header class="title">
      {{
        pageStatus === 'userSetting'
          ? i18n.t('userSetting.accountSettings')
          : i18n.t('userSetting.about')
      }}
    </header>
    <main class="content">
      <n-tabs type="segment" class="user_setting_tabs" justify-content="start">
        <n-tab-pane
          v-if="pageStatus === 'userSetting'"
          name="chap1"
          :tab="$t('userSetting.perSetting')"
        >
          <div class="setting_op_item">
            <p class="title">{{ $t('userSetting.selectLang') }}</p>
            <div>
              <n-radio-group v-model:value="curLangSelect" name="radiogroup">
                <n-radio
                  v-for="lang in langOption"
                  :key="lang.value"
                  :value="lang.value"
                >
                  {{ lang.label }}
                </n-radio>
              </n-radio-group>
            </div>
          </div>
        </n-tab-pane>
        <n-tab-pane
          v-if="pageStatus === 'userSetting'"
          name="chap2"
          :tab="$t('userSetting.notice')"
        >
          {{ $t('userSetting.notice') }}</n-tab-pane
        >
        <n-tab-pane
          v-if="pageStatus === 'userSetting'"
          name="chap3"
          :tab="$t('userSetting.infoFeedback')"
        >
          {{ $t('userSetting.infoFeedback') }}</n-tab-pane
        >

        <!-- 关于 -->
        <n-tab-pane
          v-if="pageStatus === 'about'"
          name="chap1"
          :tab="$t('userSetting.checkNewV')"
          >{{ $t('userSetting.checkNewV') }}
        </n-tab-pane>
        <n-tab-pane
          v-if="pageStatus === 'about'"
          name="chap2"
          :tab="$t('userSetting.serviceAgree')"
        >
          {{ $t('userSetting.serviceAgree') }}</n-tab-pane
        >
        <n-tab-pane
          v-if="pageStatus === 'about'"
          name="chap3"
          :tab="$t('userSetting.newFunction')"
        >
          {{ $t('userSetting.newFunction') }}</n-tab-pane
        >
        <n-tab-pane
          v-if="pageStatus === 'about'"
          name="chap4"
          :tab="$t('userSetting.priAgree')"
        >
          {{ $t('userSetting.priAgree') }}</n-tab-pane
        >
        <n-tab-pane
          v-if="pageStatus === 'about'"
          name="chap5"
          :tab="$t('userSetting.copyright')"
        >
          {{ $t('userSetting.copyright') }}</n-tab-pane
        >
      </n-tabs>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import type { WritableComputedRef } from 'vue';
import Bus from '@/tools/bus';
import { useI18n } from 'vue-i18n';

const pageStatus = ref<string>('userSetting');
const i18n = useI18n();
const langOption = [
  {
    value: 'zh-CN',
    label: '简体中文',
  },
  {
    value: 'en',
    label: 'English',
  },
];
const curLangSelect = ref<WritableComputedRef<string>>(i18n.locale);

console.log(i18n);

watch(
  () => curLangSelect.value,
  () => {
    i18n.locale.value = curLangSelect.value;
    localStorage.setItem('language', curLangSelect.value);
  }
);

Bus.$on('SELECTPROFILEMENU', (type: string) => {
  console.log(type);
  pageStatus.value = type;
});
</script>

<style>
.user_setting_c {
  width: 96.3vw;
}
.user_setting_c > .title {
  position: fixed;
  top: 0;
  z-index: 99;
  width: 100%;
  height: 60px;
  line-height: 60px;
  padding-left: 20px;
  background-color: var(--im-theme-chatPageBg);
  border-bottom: 1px solid var(--color-border);
}
.user_setting_c > .content {
  margin-top: 60px;
  background-color: var(--im-theme-chatPageBg);
}

.user_setting_tabs {
  padding-top: 10px;
  display: flex;
  box-sizing: border-box;
}
.user_setting_tabs > .n-tabs-nav {
  width: 25%;
  height: 92vh;
  border-right: 1px solid var(--color-border);
}
.user_setting_tabs > .n-tabs-nav > .n-tabs-rail {
  flex-direction: column;
  background-color: var(--im-theme-chatPageBg);
}
.user_setting_tabs > .n-tabs-nav > .n-tabs-rail > .n-tabs-tab-wrapper {
  width: 100%;
  flex-grow: 0;
}
.user_setting_tabs
  > .n-tabs-nav
  > .n-tabs-rail
  > .n-tabs-tab-wrapper
  > .n-tabs-tab {
  height: 50px;
  width: 100%;
}
/* 面板内容 */
.user_setting_tabs > .n-tab-pane {
  background-color: var(--im-theme-chatPageBg);
  padding-left: 10px;
}
/* 配置项 */
.user_setting_tabs .setting_op_item {
  padding-left: 10px;
}
.user_setting_tabs .setting_op_item > .title {
  padding-bottom: 5px;
}
</style>

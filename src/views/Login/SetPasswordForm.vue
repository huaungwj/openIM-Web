<template>
  <n-form
    ref="formRef"
    label-width="auto"
    :model="formValue"
    :rules="rules"
    size="large"
    :show-file-list="false"
  >
    <!-- 密码 -->
    <n-form-item :label="$t('login.contentRight.passwordText')" path="password">
      <n-input
        v-model:value="formValue.password"
        type="password"
        show-password-on="mousedown"
        :placeholder="$t('login.contentRight.passwordPlaceholderText')"
      />
    </n-form-item>
    <n-form-item
      :label="$t('login.contentRight.confirmPwdText')"
      path="cPassword"
    >
      <n-input
        v-model:value="formValue.cPassword"
        type="password"
        show-password-on="mousedown"
        :placeholder="$t('login.contentRight.passwordPlaceholderText')"
      />
    </n-form-item>
    <!-- 提交按钮 -->
    <n-form-item :style="{ gridTemplateRows: '0' }" label-width="auto">
      <n-button
        attr-type="button"
        type="primary"
        :style="{
          width: '100%',
        }"
        size="large"
        @click="handleSubmit"
      >
        {{ $t('login.contentRight.nextStepButtonText') }}
      </n-button>
    </n-form-item>
  </n-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { resetPasswordFormType } from './type';
import type { responseType } from '@/service/response/common';
import type { FormItemRule, FormInst } from 'naive-ui';
import { useMessage } from 'naive-ui';
import { APIResetPassword, APISetRegisterPwd } from '@/service/user/user';
import { useUserStore } from '@/stores/user';
import md5 from 'md5';
import { MD5_KEY } from '@/tools/tools';
import { uuid } from '@/tools/im/util';
import { i18n } from '@/locales/index';
import { useImLogin } from '@/hooks/useImLogin';
import type { AxiosResponse } from 'axios';

export default defineComponent({
  props: ['changePageStatus', 'phone', 'isRegister'],

  setup(props) {
    const formRef = ref<FormInst | null>(null);
    const formValue = ref<resetPasswordFormType>({
      password: '',
      cPassword: '',
    });
    const message = useMessage();
    const userStore = useUserStore();
    const { imLogin } = useImLogin();

    // 重置密码
    async function resetPasswordFun() {
      const res: AxiosResponse<responseType> & responseType =
        await APIResetPassword({
          phoneNumber: props.phone,
          verificationCode: userStore.verificationCode,
          newPassword: md5(md5(formValue.value.cPassword) + MD5_KEY),
          platform: 5,
          operationID: uuid('uuid'),
        });
      if (res.errCode === 0) {
        // 修改成功
        message.info(i18n.global.t('login.contentRight.setPwdSuccMesText'));
      } else {
        // 修改失败
        message.error(i18n.global.t('login.contentRight.errSetPwdMsgText'));
      }
      // 跳转登录页
      props.changePageStatus('login');
    }

    // 注册
    async function registerFun() {
      // 1. 保存密码
      // AxiosResponse

      const passwordRes: AxiosResponse<responseType> & responseType =
        await APISetRegisterPwd({
          phoneNumber: props.phone,
          verificationCode: userStore.verificationCode,
          password: md5(md5(formValue.value.cPassword) + MD5_KEY),
          platform: 5,
          operationID: uuid('uuid'),
        });
      if (passwordRes.errCode !== 0) {
        message.error(i18n.global.t('login.contentRight.errSetPwdRegMsgText'));
        return false;
      }
      // 2. 登录
      imLogin(passwordRes.data.userID, passwordRes.data.token);
      // 3.获取IM注册的所有用户(userID)
      // 4.切换页面状态 设置 userInfo
      props.changePageStatus('setUserInfo');
    }

    // 提交表单
    async function handleSubmit(e: Event) {
      e.preventDefault();

      formRef.value?.validate(async (errors) => {
        if (!errors) {
          // 重设密码
          if (!props.isRegister) {
            resetPasswordFun();
          } else {
            // 注册
            registerFun();
          }
        } else {
          console.log(errors);
          message.error(i18n.global.t('login.contentRight.verMsgText'));
        }
      });
    }

    return {
      formValue,
      formRef,
      rules: {
        // 表单 rules
        password: {
          // 密码
          trigger: ['input', 'blur'],
          validator(rule: FormItemRule, value: string) {
            if (!value) {
              return new Error(
                i18n.global.t('login.contentRight.changePwd1VerText1')
              );
            } else if (value.length > 20 || value.length < 6) {
              return new Error(
                i18n.global.t('login.contentRight.changePwd1VerText2')
              );
            }
          },
        },
        cPassword: {
          // 确认密码
          trigger: ['blur', 'input'],
          validator(rule: FormItemRule, value: string) {
            // 自定义rules
            if (!value) {
              return new Error(
                i18n.global.t('login.contentRight.changePwd2VerText1')
              );
            } else if (value !== formValue.value.password) {
              return new Error(
                i18n.global.t('login.contentRight.changePwd2VerText2')
              );
            } else if (value.length > 20 || value.length < 6) {
              return new Error(
                i18n.global.t('login.contentRight.changePwd2VerText3')
              );
            }
            return true;
          },
        },
      },
      handleSubmit,
    };
  },
});
</script>

<style></style>

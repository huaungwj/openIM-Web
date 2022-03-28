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
    <n-form-item label="确认密码" path="cPassword">
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
        下一步
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
import {
  APIResetPassword,
  APISetRegisterPwd,
  APIGetAuthToken,
} from '@/service/user/user';
import { useUserStore } from '@/stores/user';
import md5 from 'md5';
import { MD5_KEY } from '@/tools/tools';
import { uuid } from '@/tools/im/util';

export default defineComponent({
  props: ['changePageStatus', 'phone', 'isRegister', 'imLogin'],

  setup(props, context) {
    const formRef = ref<FormInst | null>(null);
    const formValue = ref<resetPasswordFormType>({
      password: '',
      cPassword: '',
    });
    const message = useMessage();
    const userStore = useUserStore();
    console.log(props);

    // 重置密码
    async function resetPasswordFun() {
      const res: responseType = await APIResetPassword({
        phoneNumber: props.phone,
        verificationCode: userStore.verificationCode,
        newPassword: md5(md5(formValue.value.cPassword) + MD5_KEY),
        platform: 5,
        operationID: uuid('uuid'),
      });
      console.log(res);
      if (res.errCode === 0) {
        // 修改成功
        message.info('密码重置成功，请前往登录！');
      } else {
        // 修改失败
        message.error('修改失败,请重新修改');
      }
      // 跳转登录页
      props.changePageStatus('login');
    }

    // 注册
    async function registerFun() {
      // 1. 保存密码
      const passwordRes: responseType = await APISetRegisterPwd({
        phoneNumber: props.phone,
        verificationCode: userStore.verificationCode,
        password: md5(md5(formValue.value.cPassword) + MD5_KEY),
        platform: 5,
        operationID: uuid('uuid'),
      });
      console.log(passwordRes);
      if (passwordRes.errCode !== 0) {
        message.error('无法设置密码！请联系管理员');
        return false;
      }
      console.log(passwordRes);
      // 2. 登录
      props.imLogin(passwordRes.data.userID, passwordRes.data.token);
      // 3.获取IM注册的所有用户(userID)

      // 4.切换页面状态 设置 userInfo
      props.changePageStatus('setUserInfo');
    }

    // 提交表单
    async function handleSubmit(e) {
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
          message.error('请完成验证！');
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
              return new Error('请输入密码');
            } else if (value.length > 20 || value.length < 6) {
              return new Error('需要6-20个字符');
            }
          },
        },
        cPassword: {
          // 确认密码
          trigger: ['blur', 'input'],
          validator(rule: FormItemRule, value: string) {
            // 自定义rules
            if (!value) {
              return new Error('确认密码是必填项');
            } else if (value !== formValue.value.password) {
              return new Error('两次输入的密码不一致');
            } else if (value.length > 20 || value.length < 6) {
              return new Error('需要6-20个字符');
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

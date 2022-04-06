<template>
  <div class="login_container">
    <div class="top_bar"></div>
    <div class="login_wapper">
      <!-- 左边图片部分 -->
      <div class="left_container">
        <div class="title">{{ $t('login.contentLeft.titleText') }}</div>

        <span class="sub_title">{{
          $t('login.contentLeft.subTitleText')
        }}</span>
        <img src="@/assets/login/left-img.png " />
      </div>
      <n-spin :show="pageStatus === 'success'">
        <!-- 登录表单部分 -->
        <div class="login_form">
          <!-- 返回按钮 -->
          <div
            class="form_back pointer"
            v-if="
              ['login', 'setPassword', 'setUserInfo', 'success'].every(
                (item) => item !== pageStatus
              )
            "
            @click="backHistoryPage"
          >
            <i style="font-size: 23px" class="iconfont openIM-back"></i>
            <span>{{ $t('login.contentRight.backButtonText') }}</span>
          </div>
          <div class="form_title">
            <!-- 标题 -->
            <div class="title" v-if="pageStatus !== 'success'">
              {{ $t(`login.contentRight.${pageStatus}TitleText`) }}
            </div>
            <!-- 副标题 -->
            <div
              class="sub_title"
              v-if="
                ['setResetPwd', 'setPwd', 'setUserInfo'].some(
                  (item) => item === pageStatus
                )
              "
            >
              {{ $t(`login.contentRight.${pageStatus}subTitleText`) }}
            </div>
          </div>
          <!-- 表单 -->
          <n-form
            v-if="
              ['login', 'resetPwd', 'register'].some(
                (item) => item === pageStatus
              )
            "
            ref="formRef"
            label-width="auto"
            :model="formValue"
            :rules="rules"
            :size="size"
          >
            <!-- v-if="pageStatus !== 'validateCode'" -->
            <!-- 电话号码 -->
            <n-form-item
              :label="$t('login.contentRight.phoneText')"
              path="phone"
            >
              <n-select
                v-model:value="formValue.areaCode"
                :style="{ width: '33%', borderTopRightRadius: '0px' }"
                :options="AreaCodes"
              />
              <n-input
                default-value=""
                v-model:value="formValue.phone"
                :placeholder="$t('login.contentRight.phonePlaceholderText')"
                :maxlength="11"
                autocomplete="off"
              />
            </n-form-item>
            <!-- 密码 -->
            <n-form-item
              v-if="pageStatus === 'login'"
              :label="$t('login.contentRight.passwordText')"
              path="password"
            >
              <n-input
                v-model:value="formValue.password"
                default-value=""
                type="password"
                @keydown.enter="handleSubmit"
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
                {{ $t(`login.contentRight.${pageStatus}ButtonText`) }}
              </n-button>
            </n-form-item>
            <!-- 用户协议 -->
            <n-form-item
              v-if="pageStatus === 'login' || pageStatus === 'register'"
              :style="{ gridTemplateRows: '0', fontSize: '12px' }"
              path="checked"
            >
              <n-checkbox v-model:checked="formValue.checked" /> &nbsp; &nbsp;
              <span>{{ $t(`login.contentRight.agreementText1`) }}</span>
              <span class="pointer" style="color: var(--im-theme-dark-color)"
                >&nbsp;{{
                  $t(`login.contentRight.agreementText2`)
                }}&nbsp; </span
              >{{ $t(`login.contentRight.agreementText3`) }}
              <span class="pointer" style="color: var(--im-theme-dark-color)">
                &nbsp;{{ $t(`login.contentRight.agreementText4`) }} &nbsp;
              </span>
            </n-form-item>
          </n-form>

          <!-- 验证码 -->
          <signCode
            v-else-if="pageStatus === 'validateCode'"
            :number="6"
            :wait-timer="waitTimer"
            :phone="formValue.phone"
            :renew-get-code="renewGetCode"
            :wait-timer-show="waitTimerShow"
            :forget-pwd-and-regFun="forgetPwdAndRegFun"
            :change-page-status="changePageStatus"
            :is-register="isRegister"
          />
          <!-- 设置密码组件 -->
          <set-password-form
            v-else-if="
              ['setResetPwd', 'setPwd'].some((item) => item === pageStatus)
            "
            :change-page-status="changePageStatus"
            :phone="formValue.phone"
            :is-register="isRegister"
          />

          <!-- 设置用户信息 -->
          <setInfo v-else-if="pageStatus === 'setUserInfo'" />

          <!-- 底部忘记密码部分 -->
          <div class="form_bottom" v-if="pageStatus === 'login'">
            <span
              class="pointer"
              @click="changePageStatus('resetPwd', $event)"
              >{{ $t('login.contentRight.forgetPwdText') }}</span
            >
            <span
              class="pointer"
              @click="changePageStatus('register', $event)"
              >{{ $t('login.contentRight.registerNowText') }}</span
            >
          </div>
        </div>
      </n-spin>
    </div>
    <!-- 底部 绿条 -->
    <div class="login_bottom"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import SetPasswordForm from '@/views/Login/SetPasswordForm.vue';
import signCode from '@/components/getAuthCode/Index.vue';
import setInfo from '@/views/Login/SetInfo.vue';
import type { FormValidationError, FormInst, FormItemRule } from 'naive-ui';
import type { FormValueType } from './type';
import { APIGetCode, APILogin } from '@/service/user/user';
// import type { getCodetype } from '@/service/user/type';
import type { responseType } from '@/service/response/common';
import { uuid } from '@/tools/im/util';
import i18n from '@/lang/i18n';
import md5 from 'md5';
import { MD5_KEY } from '@/tools/tools';
import { useImLogin } from '@/hooks/useImLogin';

export default defineComponent({
  components: {
    signCode,
    SetPasswordForm,
    setInfo,
  },

  setup(props, context) {
    // router
    const router = useRouter();
    const formRef = ref<FormInst | null>(null);
    const message = useMessage();
    // 页面状态， 分别是：login，register，restPwd, 默认是 login
    const pageStatus = ref<string>('login');
    // 页面历史状态
    const historyStatus = ref<string[]>([]);
    // 等待秒数，重新获取
    let waitTimer = ref<number>(60);
    // 计时器状态
    const waitTimerShow = ref<boolean>(false);
    // 更新获取代码状态
    const renewGetCode = ref<boolean>(false);
    // 表单数据
    const formValue = ref<FormValueType>({
      areaCode: '+86',
      phone: '',
      password: '',
      checked: false,
    });
    // 延时器
    let timer_interval: number;
    // 是否注册标识
    const isRegister = ref<boolean>(false);

    // useImLogin
    const { imLogin } = useImLogin();

    // 登录 callback
    async function loginFun() {
      // 1. 登录 换取 token
      const res: responseType<ILogin> = await APILogin({
        phoneNumber: formValue.value.phone,
        password: md5(md5(formValue.value.password) + MD5_KEY),
      });
      // 2. ws 登录
      if (res.errCode === 0) {
        console.log(res);
        // loading 关闭
        pageStatus.value = '';
        // 跳转主页面
        router.replace({ path: '/' });
      } else if (res.errCode === 10004) {
        message.error(i18n.global.t('login.contentRight.errPwdMsgText'));
        pageStatus.value = 'login';
        return false;
      } else if (res.errCode === 10003) {
        message.error(i18n.global.t('login.contetnRight.errNotRegMsgText'));
        pageStatus.value = 'login';
        return false;
      } else {
        message.error(i18n.global.t('login.contetnRight.errUnknownMsgText'));
        pageStatus.value = 'login';
        return false;
      }
      imLogin(res.data?.userID, res.data.token);
    }

    // 忘记密码
    async function forgetPwdAndRegFun() {
      renewGetCode.value = false; // 重新拉取验证码隐藏
      waitTimerShow.value = true; // 计时器显示
      waitTimer.value = 59;
      // 1. 获取手机验证码
      isRegister.value = pageStatus.value === 'resetPwd' ? false : true;
      const res: responseType = await APIGetCode({
        phoneNumber: formValue.value.phone,
        usedFor: isRegister.value ? 1 : 2,
        operationID: uuid('uuid'),
      });
      if (res.errCode === 10008) {
        message.error(i18n.global.t('login.contentRight.sendCodeVerMsgText1'));
      } else if (res.errCode === 10002 && isRegister) {
        message.error(i18n.global.t('login.contentRight.sendCodeVerMsgText2'));
        return false;
      } else {
        message.success(
          i18n.global.t('login.contentRight.sendCodeVerMsgText3')
        );
      }
      pageStatus.value = 'validateCode'; // 页面状态
      // 2. 启动延时器
      timer_interval = setInterval(() => {
        if (waitTimer.value > 0) {
          waitTimer.value--;
        } else {
          waitTimerShow.value = false;
          renewGetCode.value = true;
          clearInterval(timer_interval);
        }
      }, 1000);
    }

    return {
      // 是否点击了注册
      isRegister,
      // 忘记密码事件函数
      forgetPwdAndRegFun,
      // 是否重新拉取验证码
      renewGetCode,
      // 是否显示秒数
      waitTimerShow,
      // 等待的秒数
      waitTimer,
      pageStatus,
      // 电话地域信息
      AreaCodes: ref([
        {
          label: '+86',
          value: '+86',
        },
        {
          label: '+89',
          value: '+89',
        },
      ]),
      formRef, // 表单元素
      size: ref<string>('medium'), // 表单尺寸
      //表单数据
      formValue,
      rules: {
        // 表单 rules
        phone: {
          // 电话号码
          required: true,
          trigger: ['input'],
          validator(rule: FormItemRule, value: string) {
            // 自定义rules
            if (!value) {
              return new Error(
                i18n.global.t('login.contentRight.phoneVerText1')
              );
            } else if (!/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(value)) {
              return new Error(
                i18n.global.t('login.contentRight.phoneVerText2')
              );
            }
            return true;
          },
        },
        password: {
          // 密码
          trigger: ['input'],
          validator(rule: FormItemRule, value: string) {
            if (!value) {
              return new Error(i18n.global.t('login.contentRight.pwdVerText1'));
            } else if (value.length > 20 || value.length < 6) {
              return new Error(i18n.global.t('login.contentRight.pwdVerText2'));
            }
            return true;
          },
        },
        checked: {
          // 用户协议
          required: true,
          trigger: ['blur'],
          validator(rule: FormItemRule, value: string) {
            // 自定义rules
            if (!value) {
              return new Error(
                i18n.global.t('login.contentRight.agreementVerText')
              );
            }
            return true;
          },
        },
      },
      // submit callback
      handleSubmit(e: MouseEvent) {
        e.preventDefault();
        // console.log(pageStatus);
        // const cb: FormValidateCallback
        formRef.value?.validate((errors?: Array<FormValidationError>) => {
          console.log(errors);
          if (!errors) {
            // message.success('验证通过');
            if (pageStatus.value === 'login') {
              // 改变 pageStatus 的状态
              pageStatus.value = 'success';
              // 登录
              loginFun();
            } else if (
              pageStatus.value === 'resetPwd' ||
              pageStatus.value === 'register'
            ) {
              // 忘记密码 和 注册 去获取验证码
              historyStatus.value.push(pageStatus.value); // 添加一条历史
              forgetPwdAndRegFun();
            }
          } else {
            // console.log(errors);
            message.error(i18n.global.t('login.contentRight.verMsgText'));
          }
        });
      },
      // 改变 pageStatus
      changePageStatus(type: string, e: MouseEvent) {
        // console.log(historyStatus.value);
        if (type === 'login') {
          // 如果是 login 则是返回第一页
          historyStatus.value = historyStatus.value.slice(0, 0);
        } else {
          historyStatus.value.push(pageStatus.value);
        }
        pageStatus.value = type;
      },
      // 返回上一个页面状态
      backHistoryPage() {
        // console.log(historyStatus.value.length);
        if (timer_interval) {
          // 有定时器则清除
          waitTimerShow.value = false;
          renewGetCode.value = true;
          clearInterval(timer_interval);
        }
        pageStatus.value = historyStatus.value[historyStatus.value.length - 1];
        // 返回上一个页面完，需要把最后的删除
        historyStatus.value.pop();
      },
    };
  },
});
</script>

<style>
/* login 页面盒子 */
.login_container {
  display: flex;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

/* -------------------   登录盒子 ---------------------  */
.login_wapper {
  display: flex;
  align-items: center;
  padding: 2rem;
}
/* ----------------- 登录左边盒子 -------------------- */
.login_wapper > .left_container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: var(--color-text);
  padding-left: 20px;
}
.left_container > .title {
  font-size: 22px;
  font-weight: 500;
  color: var(--color-heading);
  padding: 43px 0 10px 0;
}
.left_container > .sub_title {
  font-size: 12px;
  padding-bottom: 20px;
}
/* ----------- 图片 -------------------  */
.left_container > img {
  width: 70%;
}

/* ---------------- 右边登录框  ------------------- */
.login_wapper .login_form {
  width: 400px;
  height: 470px;
  background-color: var(--color-background-soft);
  padding: 3rem 4rem;
  border-radius: 1rem;
  box-shadow: 0 0 30px rgb(0 0 0 / 20%);
}
/* -------------------------- 返回盒子 ---------------- */
.login_form > .form_back {
  display: inline-flex;
  align-items: center;
}
/* ---------------------- 登录框标题 ------------------- */
.login_form > .form_title {
  padding-bottom: 24px;
}
.login_form > .form_title > .title {
  font-weight: 500;
  color: var(--color-heading);
}
/* --------------- 表单副标题 --------------------------- */
.login_form > .form_title > .sub_title {
  color: var(--im-theme-primary);
  font-size: 13px;
}
/* ------------------------ 登录底部忘记密码 -------------- */
.form_bottom {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--im-theme-dark-color);
}

/* ------------------- 底部 ---------------- */
.login_container > .login_bottom {
  width: 100vw;
  height: 30px;
  background-color: var(--im-theme-primary);
}
</style>

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
      <!-- 登录表单部分 -->
      <div class="login_form">
        <!-- 返回按钮 -->
        <div
          class="form_back pointer"
          v-if="pageStatus !== 'login'"
          @click="backHistoryPage"
        >
          <i style="font-size: 23px" class="iconfont openIM-back"></i>
          <span>返回</span>
        </div>
        <div class="form_title">
          {{ $t(`login.contentRight.${pageStatus}TitleText`) }}
        </div>
        <!-- 表单 -->
        <n-form
          v-if="pageStatus !== 'validateCode'"
          ref="formRef"
          label-width="auto"
          :model="formValue"
          :rules="rules"
          :size="size"
        >
          <!-- 电话号码 -->
          <n-form-item :label="$t('login.contentRight.phoneText')" path="phone">
            <n-select
              v-model:value="formValue.areaCode"
              :style="{ width: '33%', borderTopRightRadius: '0px' }"
              :options="AreaCodes"
            />
            <n-input
              v-model:value="formValue.phone"
              :placeholder="$t('login.contentRight.phonePlaceholderText')"
              :maxlength="11"
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
            <span>我已阅读并同意</span>
            <span class="pointer" style="color: var(--im-theme-dark-color)"
              >&nbsp;用户协议&nbsp; </span
            >和
            <span class="pointer" style="color: var(--im-theme-dark-color)">
              &nbsp;隐私协议 &nbsp;
            </span>
          </n-form-item>
        </n-form>

        <!-- 验证码 -->
        <signCode
          v-else
          :number="6"
          :wait-timer="waitTimer"
          :phone="formValue.phone"
          :renew-get-code="renewGetCode"
          :wait-timer-show="waitTimerShow"
          :forget-pwd-fun="forgetPwdFun"
        />

        <!-- 底部忘记密码部分 -->
        <div class="form_bottom" v-if="pageStatus === 'login'">
          <span class="pointer" @click="formBottomFun('resetPwd', $event)"
            >忘记密码</span
          >
          <span class="pointer" @click="formBottomFun('register', $event)"
            >立即注册</span
          >
        </div>
      </div>
    </div>
    <!-- 底部 绿条 -->
    <div class="login_bottom"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { FormInst, FormItemRule } from 'naive-ui';
import { useMessage } from 'naive-ui';
import type { FormValueType } from './type';
import signCode from '@/components/getAuthCode/Index.vue';
import { getCode } from '@/service/user/user';
// import type { getCodetype } from '@/service/user/type';
import type { responseType } from '@/service/response/common';

export default defineComponent({
  components: {
    signCode,
  },
  setup() {
    const formRef = ref<FormInst | null>(null);
    const message = useMessage();
    // 页面状态， 分别是：login，register，restPwd, 默认是 login
    const pageStatus = ref<string>('login');
    // 页面历史状态
    const historyStatus = ref<string[]>([]);
    // 等待秒数，重新获取
    let waitTimer = ref<number>(5);
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

    // 登录 callback
    function loginFun() {}
    // 忘记密码
    async function forgetPwdFun() {
      renewGetCode.value = false; // 重新拉取验证码隐藏
      waitTimerShow.value = true; // 计时器显示
      waitTimer.value = 4;
      // 1. 获取手机验证码
      const res: responseType = await getCode({
        phoneNumber: formValue.value.phone,
        usedFor: 2,
        operationID: '1648274924901',
      });
      if (res.errCode !== 0) {
        message.error('发送手机验证码失败，请使用超级验证码！');
      } else {
        message.success('验证码发送成功');
      }
      // 2. 启动延时器
      let timer_interval = setInterval(() => {
        if (waitTimer.value > 0) {
          waitTimer.value--;
          console.log(waitTimerShow);
        } else {
          waitTimerShow.value = false;
          renewGetCode.value = true;
          clearInterval(timer_interval);
        }
      }, 1000);
    }
    function registerFun() {}
    return {
      // 忘记密码事件函数
      forgetPwdFun,
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
              return new Error('请输入手机号码');
            } else if (!/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(value)) {
              return new Error('手机号码的格式不正确！');
            }
            return true;
          },
        },
        password: {
          // 密码
          required: true,
          message: '请输入密码',
          trigger: ['input'],
        },
        checked: {
          // 用户协议
          required: true,
          trigger: ['blur'],
          validator(rule: FormItemRule, value: string) {
            // 自定义rules
            if (!value) {
              return new Error('请勾选用户协议');
            }
            return true;
          },
        },
      },
      // submit callback
      handleSubmit(e: MouseEvent) {
        e.preventDefault();
        console.log(pageStatus);

        formRef.value?.validate((errors) => {
          if (!errors) {
            message.success('验证通过');
            if (pageStatus.value === 'login') {
              // 登录
              loginFun();
            } else if (pageStatus.value === 'resetPwd') {
              // 忘记密码
              historyStatus.value.push(pageStatus.value); // 添加一条历史
              pageStatus.value = 'validateCode'; // 页面状态
              forgetPwdFun();
            } else {
              //注册
            }
          } else {
            console.log(errors);
            message.error('请完成验证！');
          }
        });
      },
      // 忘记密码 和 注册点击函数
      formBottomFun(type: string, e: MouseEvent) {
        historyStatus.value.push(pageStatus.value);
        pageStatus.value = type;
      },
      // 返回上一个页面状态
      backHistoryPage() {
        // console.log(historyStatus.value.length);
        console.log(historyStatus.value);
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
.login_wapper > .login_form {
  background-color: var(--color-background-soft);
  padding: 3rem 4rem;
  border-radius: 1rem;
  box-shadow: 0 0 30px rgb(0 0 0 / 20%);
  height: 453px;
}
/* -------------------------- 返回盒子 ---------------- */
.login_form > .form_back {
  display: flex;
  align-items: center;
}
/* ---------------------- 登录框标题 ------------------- */
.login_form > .form_title {
  padding-bottom: 24px;
  font-weight: 500;
  color: var(--color-heading);
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

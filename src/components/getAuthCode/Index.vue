<template>
  <div class="code_container">
    <span class="sub_tip"
      >请输入发送至
      <span> +86 {{ phone }}</span> 的6位验证码，有效期十分钟。</span
    >
    <!-- 验证码框 -->
    <div class="verificationCodeBox">
      <label for="code">
        <ul class="verificationCodeContainer">
          <li
            ref="codeLi"
            class="field-wrap"
            v-for="(item, index) in number"
            :key="index"
            :class="{ 'input-active': value.length === index }"
            :style="{
              'border-color': value.length === index ? currentColor : '#BDC3CE',
            }"
          >
            <i
              class="after"
              :style="{
                background: value.length === index ? currentColor : '#BDC3CE',
              }"
            ></i>
            <i class="char-field">{{ value[index] }}</i>
          </li>
        </ul>
      </label>
      <input
        ref="input"
        class="input-code"
        @keyup="handleInput($event)"
        v-model="value"
        id="code"
        name="code"
        type="tel"
        :maxlength="number"
        autofocus="autofocus"
        autocorrect="off"
        autocomplete="off"
        autocapitalize="off"
        @blur="handleBlur"
      />
    </div>
    <!-- 底部重新获取 -->
    <div class="code_tip">
      <span v-show="waitTimerShow"
        ><span class="pointer">{{ waitTimer }}s</span> &nbsp;后重新发送</span
      >
      <span v-show="renewGetCode" @click="ReacquireCode" class="pointer"
        >重新获取</span
      >
    </div>

    <!-- 提交按钮 -->
    <n-button
      attr-type="button"
      type="primary"
      :style="{
        width: '100%',
      }"
      size="large"
      @click="submitVerifyCode"
    >
      <!-- {{ $t(`login.contentRight.${pageStatus}ButtonText`) }} -->
      下一步
    </n-button>

    {{ userStore.verificationCode }}
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onUpdated } from 'vue';
import { APIVerifyCode } from '@/service/user/user';
import type { responseType } from '@/service/response/common';
import { useMessage } from 'naive-ui';
import { debounce } from '@/tools/tools';
import { useUserStore } from '@/stores/user';

// 声明一个 ref 来存放该元素的引用
// 必须和模板 ref 同名
// const input = ref<HTMLInputElement | null>(null);
// 验证码
let value = ref<string>('');

export default defineComponent({
  props: [
    'number',
    'waitTimer',
    'phone',
    'renewGetCode',
    'waitTimerShow',
    'changePageStatus',
    'forgetPwdAndRegFun',
    'isRegister',
  ],

  setup(props, context) {
    const userStore = useUserStore();
    const message = useMessage();
    console.log(props);

    // 更新 生命周期钩子
    onUpdated(() => {
      console.log('更新了');
    });

    function handleSubmit() {
      context.emit('input', value.value);
    }
    // 下一步 提交验证码是否正确
    const submitVerifyCode = debounce(async function () {
      // 1. 提交输入的验证码是否正确
      const res: responseType = await APIVerifyCode({
        phoneNumber: props.phone,
        verificationCode: value.value,
        usedFor: props.isRegister ? 1 : 2,
        operationID: new Date().getTime() + '',
      });
      console.log(res);
      if (res.errCode !== 0) {
        message.error('验证码错误!');
      } else {
        // 改变 pinia user.code
        userStore.changeVeriCode(value.value);
        // 切换页面
        props.changePageStatus(props.isRegister ? 'setPwd' : 'setResetPwd');
        // 清空 value
        value.value = '';
        message.success('验证成功');
      }
    }, 500);

    function handleInput(e: KeyboardEvent) {
      // input.value = value.value;
      console.log(value);
      if (value.value.length >= this.number) {
        // 当输入满了之后自动调用
        submitVerifyCode();
      }
      handleSubmit();
    }

    //重新获取验证码;
    function ReacquireCode() {
      //  1. 清空输入框
      value.value = '';
      // 2. pinia 状态 changeVeriCode 清空
      userStore.changeVeriCode('');
      // 调用 forgetPwdAndRegFun
      props.forgetPwdAndRegFun();
    }

    function handleBlur() {
      context.emit('input', value.value);
    }
    return {
      userStore,
      value,
      currentColor: '#57be6b',
      handleBlur,
      handleInput,
      submitVerifyCode,
      ReacquireCode,
    };
  },
});
</script>

<style>
.sub_tip > span {
  color: var(--im-theme-primary);
}

.verificationCodeBox {
  overflow: hidden;
  position: relative;
  margin: 20px 0;
}

.verificationCodeContainer {
  margin: 0;
  padding: 0;
  display: flex;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  justify-content: center;
}
.field-wrap {
  list-style: none;
  display: inline-block;
  width: 35px;
  height: 35px;
  line-height: 35px;
  font-size: 16px;
  background-color: #fff;
  margin: 0 3px;
  color: #08090b;
  border: 1px solid;
  border-color: #bdc3ce;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  display: -webkit-flex;
  border-radius: 8px;
}

.char-field {
  font-style: normal;
  width: 100%;
  text-align: center;
}

.input-active .after {
  content: '';
  display: block;
  width: 2px;
  height: 24px;
  margin-left: 18px;
  margin-top: 7px;
  animation: blink 1s infinite steps(1, start);
  -o-animation: blink 1s infinite steps(1, start);
  -moz-animation: blink 1s infinite steps(1, start);
  -webkit-animation: blink 1s infinite steps(1, start);
}
@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.input-code {
  position: absolute;
  left: -99999px;
  top: -99999px;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: -1;
  outline: none;
  color: transparent;
  /* caret-color: transparent; */
  border: none;
}

.code_container > .code_tip {
  padding-bottom: 20px;
}
</style>

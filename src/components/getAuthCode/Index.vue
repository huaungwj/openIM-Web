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
    <div>
      <span v-show="waitTimerShow">{{ waitTimer }}s后重新发送</span>
      <span v-show="renewGetCode" @click="forgetPwdFun" class="pointer"
        >重新获取</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

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
    'forgetPwdFun',
  ],

  setup(props, context) {
    console.log(props);
    function handleSubmit() {
      context.emit('input', value.value);
    }

    function handleInput(e: KeyboardEvent) {
      // input.value = value.value;
      console.log(value);
      if (value.value.length >= this.number) {
        // hideKeyboard();
      }
      handleSubmit();
    }

    function handleBlur() {
      context.emit('input', value.value);
    }
    return {
      value,
      currentColor: '#57be6b',
      handleBlur,
      handleInput,
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
</style>

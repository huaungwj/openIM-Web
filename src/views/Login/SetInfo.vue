<template>
  <div class="info_container" style="text-align: center">
    <!-- 头像 -->
    <UplaodAvatar
      :is-edit="false"
      :getUplaodURL="getUplaodURL"
      :faceURL="userInfo.faceURL"
    />

    <!-- 输入名字 -->
    <n-form
      :model="userInfo"
      :rules="rules"
      ref="infoFormRef"
      label-placement="left"
      require-mark-placement="right-hanging"
      size="medium"
    >
      <n-form-item
        :label="$t('login.contentRight.yourNameText')"
        path="nickname"
        label-width="auto"
      >
        <n-input
          v-model:value="userInfo.nickname"
          :placeholder="$t('login.contentRight.yourNamePlaceholderText')"
          :minlength="3"
          :maxlength="10"
        />
      </n-form-item>
      <n-form-item label-width="auto">
        <n-button
          attr-type="button"
          type="primary"
          :style="{
            width: '100%',
          }"
          size="large"
          @click="handleSubmit"
        >
          {{ $t('login.contentRight.goWeiChatButtonText') }}
        </n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import type { FormInst, FormItemRule, FormValidationError } from 'naive-ui';
import UplaodAvatar from '@/components/UploadAvatar/UploadAvatar.vue';
import { useUserStore } from '@/stores/user';
import type { InfoField } from './type';
import { im } from '@/tools';
import { i18n } from '@/locales/index';

export default defineComponent({
  components: {
    UplaodAvatar,
  },

  setup() {
    // 表单 ref
    const infoFormRef = ref<FormInst | null>(null);
    const userInfo = ref({
      userID: 'userID',
      nickname: '',
      faceURL: `ic_avatar_0${Math.ceil(Math.random() * 9)}`,
    });
    // message
    const message = useMessage();
    // userStore
    const userStore = useUserStore();
    // useRouter
    const router = useRouter();

    // 获取头像上传后的头像URL
    const getUplaodURL = (url: string) => {
      userInfo.value.faceURL = url;
    };

    /**
     * 保存用户资料
     * @param values
     */
    const setIMInfo = (values: InfoField) => {
      values.userID = userStore.selfInfo.userID;
      // API 接口保存
      im.setSelfInfo(values)
        .then(() => {
          userStore.setSelfInfo(values);
          // 跳转页面
          router.replace('/');
        })
        .catch(() => {
          message.error(i18n.global.t('login.contentRight.errMsgText'));
        });
    };

    /**
     * 提交表单 进入im
     *
     */
    const handleSubmit = () => {
      infoFormRef.value?.validate((errors?: Array<FormValidationError>) => {
        console.log(errors);
        if (!errors) {
          message.success(i18n.global.t('login.contentRight.verCodeMsgText3'));
          // 1. 保存用户资料
          setIMInfo(userInfo.value);
          // 2. 切换页面状态 success
        } else {
          console.log(errors);
          message.error(i18n.global.t('login.contentRight.verMsgText'));
        }
      });
    };

    return {
      userInfo,
      getUplaodURL,
      rules: {
        nickname: {
          trigger: ['blur', 'input'],
          validator: (rule: FormItemRule, value: string) => {
            if (!value) {
              return new Error(
                i18n.global.t('login.contentRight.userInfoVerText1')
              );
            } else if (value.length < 3) {
              return new Error(
                i18n.global.t('login.contentRight.userInfoVerText2')
              );
            }
          },
        },
      },
      handleSubmit,
      infoFormRef,
    };
  },
});
</script>

<style>
.avatar_upload {
  display: flex;
  justify-content: center;
  padding-bottom: 20px;
}
</style>

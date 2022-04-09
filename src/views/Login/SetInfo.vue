<template>
  <div class="info_container" style="text-align: center">
    <!-- 头像 -->
    <n-upload
      class="avatar_upload"
      action=""
      accept="image/*"
      name="avatar"
      id="touxiang"
      :custom-request="cusromUpload"
      list-type="image-card"
      :max="1"
      :on-remove="deleteAvatar"
    >
      <my-avatar :src="userInfo.faceURL" />
      <div
        :style="{
          fontSize: '12px',
          color: '#777',
          marginTop: '8px',
          display: userInfo.faceURL === '' ? 'block' : 'none',
        }"
      >
        {{ $t('login.contetnRight.clickUploadText') }}
      </div>
    </n-upload>

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
import { defineComponent, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import type { FormInst, FormItemRule, FormValidationError } from 'naive-ui';
import MyAvatar from '@/components/myAvatar/MyAvatar.vue';
import { getCosAuthorization, cosUpload } from '@/tools/cos';
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import { useUserStore } from '@/stores/user';
import type { InfoField } from './type';
import { im } from '@/tools';
import i18n from '@/lang/i18n';

export default defineComponent({
  components: {
    MyAvatar,
  },

  setup(props) {
    // 表单 ref
    const infoFormRef = ref<FormInst | null>(null);
    const userInfo = ref({
      userID: 'userID',
      nickname: '',
      faceURL: `ic_avatar_0${Math.ceil(Math.random() * 6)}`,
    });
    // message
    const message = useMessage();
    // userStore
    const userStore = useUserStore();
    // useRouter
    const router = useRouter();
    // console.log(props);

    /**
     * 自定义上传头像
     * @param data
     */
    const cusromUpload = async (data: UploadRequestOption) => {
      console.log('执行了', data);
      await getCosAuthorization();
      cosUpload(data.file)
        .then((res) => {
          console.log(res);
          userInfo.value.faceURL = res.url;
        })
        .catch((err) => {
          console.log(err);
        });
    };
    // 删除头像
    const deleteAvatar = () => {
      userInfo.value.faceURL = `ic_avatar_0${Math.ceil(Math.random() * 6)}`;
    };

    /**
     * 保存用户资料
     * @param values
     */
    const setIMInfo = (values: InfoField) => {
      values.userID = userStore.selfInfo.userID;
      // API 接口保存
      im.setSelfInfo(values)
        .then((res) => {
          userStore.setSelfInfo(values);
          // 跳转页面
          router.replace('/');
        })
        .catch((err) => {
          message.error(i18n.global.t('login.contentRight.errMsgText'));
        });
    };

    /**
     * 提交表单 进入im
     * @param
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
      cusromUpload,
      deleteAvatar,
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

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
        点击上传
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
      <n-form-item label="你的姓名" path="nickname" label-width="auto">
        <n-input
          v-model:value="userInfo.nickname"
          placeholder="请填写真实姓名"
          :minlength="3"
          :maxlength="10"
        />
      </n-form-item>
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
          进入 weiChat
        </n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import type { FormInst, FormItemRule } from 'naive-ui';
import MyAvatar from '@/components/myAvatar/MyAvatar.vue';
import { getCosAuthorization, cosUpload } from '@/tools/cos';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { useUserStore } from '@/stores/user';
import type { InfoField } from './type';
import { im } from '@/tools';

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

    // 自定义上传头像
    const cusromUpload = async (data: UploadRequestOption) => {
      console.log('执行了', data);
      await getCosAuthorization();
      cosUpload(data.file)
        .then((res) => {
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
    // 保存用户资料
    const setIMInfo = (values: InfoField) => {
      console.log(userStore.selfInfo);
      values.userID = userStore.selfInfo.userID;
      console.log();
      im.setSelfInfo(values)
        .then((res) => {
          userStore.setSelfInfo(values);
          console.log(router);
          // 跳转页面
          router.push('/');
        })
        .catch((err) => {
          message.error('出错啦！');
        });
    };

    // 提交进入
    const handleSubmit = () => {
      infoFormRef.value?.validate((errors: Array) => {
        console.log(errors);
        if (!errors) {
          message.success('验证通过');
          // 1. 保存用户资料
          setIMInfo(userInfo.value);
          // 2. 切换页面状态 success
        } else {
          console.log(errors);
          message.error('请完成验证！');
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
              return new Error('请输入姓名');
            } else if (value.length < 3) {
              return new Error('姓名长度不能小于3位');
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

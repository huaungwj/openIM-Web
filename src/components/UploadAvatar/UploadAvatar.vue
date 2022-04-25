<template>
  <n-upload
    class="avatar_upload"
    ref="uploadAvatarRef"
    action=""
    accept="image/*"
    name="avatar"
    id="touxiang"
    :custom-request="cusromUpload"
    list-type="image-card"
    :max="1"
    :on-remove="deleteAvatar"
  >
    <my-avatar :src="props.faceURL" />
    <div
      :style="{
        fontSize: '12px',
        color: '#777',
        marginTop: '8px',
        display: props.faceURL === '' ? 'block' : 'none',
      }"
    >
      {{ $t('login.contentRight.clickUploadText') }}
    </div>
  </n-upload>
</template>

<script lang="ts" setup>
import { ref, defineProps } from 'vue';
import { useMessage } from 'naive-ui';
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import MyAvatar from '../myAvatar/MyAvatar.vue';
import { fileSizeTran } from '../../tools/tools';
import { getCosAuthorization, cosUpload } from '../../tools/cos';

const props = defineProps<{
  getUplaodURL: (url: string) => void;
  faceURL: string;
}>();
const uploadAvatarRef = ref<HTMLElement>(null as unknown as HTMLElement);
const message = useMessage();

/**
 * 自定义上传头像
 * @param data
 */
const cusromUpload = async (data: UploadRequestOption) => {
  if (!data) return false;

  console.log(uploadAvatarRef);
  if (data.file.file.size! > 2097152) {
    uploadAvatarRef.value.clear();
    return message.warning(
      `当前文件大小为：${fileSizeTran(data.file.file.size)}头像文件不能大于2MB`
    );
  }
  await getCosAuthorization();
  cosUpload(data.file)
    .then((res) => {
      uploadAvatarRef.value.clear();
      props.getUplaodURL(res.url);
    })
    .catch((err) => {
      console.log(err);
    });
};

// 删除头像
const deleteAvatar = () => {
  props.getUplaodURL(`ic_avatar_0${Math.ceil(Math.random() * 6)}`);
};
</script>

<style></style>

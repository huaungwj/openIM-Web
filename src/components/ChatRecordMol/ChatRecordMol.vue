<template>
  <!-- :title="$t('chatRecord')" -->
  <n-modal
    v-model:show="chatRecordIsShow"
    class="custom-card"
    preset="card"
    :style="bodyStyle"
    size="huge"
    :bordered="false"
  >
    <template #header>
      <header class="chat_r_m_header">
        <MyAvatar :src="cveStore.curCve.faceURL" :size="40" />
        <p>
          <span class="nickname">{{ cveStore.curCve.showName }}</span>
          <span class="peopel_number" v-if="!isSingleCve(cveStore.curCve)"
            >（{{ contactsStore.groupInfo.memberCount }}）</span
          >
        </p>
      </header>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import MyAvatar from '../myAvatar/MyAvatar.vue';
import Bus from '@/tools/bus';
import { useCveStore } from '@/stores/cve';
import { useContactsStore } from '@/stores/contacts';
import { isSingleCve } from '@/tools';

const chatRecordIsShow = ref<boolean>(false);
const cveStore = useCveStore();
const contactsStore = useContactsStore();
const bodyStyle = { width: '600px', maxHeight: '500px' };

onMounted(() => {
  console.log('渲染完成了');
  Bus.$on('SHOWCHATRECORDMOL', (status: boolean) => {
    chatRecordIsShow.value = status;
  });
});
</script>

<style>
.chat_r_m_header {
  display: flex;
  align-items: center;
}
</style>

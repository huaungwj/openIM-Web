<template>
  <div class="new_g_new_f_c">
    <!-- 内容区域 -->
    <div v-if="contactsStore.newFGList.data.length > 0">
      <main v-for="item in newFGArr" :key="item.initial" :id="item.key">
        <!-- 头部锚点 -->
        <div class="sections_title" v-if="item.data.length > 0">
          {{ item.initial }}
        </div>
        <!-- 内容 -->
        <main class="fg_list_c" v-if="item.data.length > 0">
          <FGItemComp
            v-for="content in item.data"
            :key="content.createTime"
            :con="content"
            :type="type"
            :initial="item.key"
            :goChatFun="goChatFun"
          />
        </main>
      </main>
    </div>
    <!-- 空 -->
    <Empty
      v-else
      :imgSrc="`${$isDark.value ? Empty3 : Empty2}`"
      :width="400"
      :height="300"
    >
      <template #header>
        <p>{{ $t('emptyData') }}</p>
      </template>
    </Empty>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, onMounted, defineProps } from 'vue';
import { useContactsStore } from '@/stores/contacts';
import FGItemComp from '@/views/Home/Contact/contactRight/components/FGItemComp.vue';
import Empty from '@/components/Empty/Empty.vue';
import Empty3 from '@/assets/images/empty3.png';
import Empty2 from '@/assets/images/empty2.png';
import { useI18n } from 'vue-i18n';
import type {
  FriendApplicationItem,
  GroupApplicationItem,
} from '@/tools/im/types';
import type { SessionType } from '@/tools/im/constants/messageContentType';

type newFGArrType = {
  data: FriendApplicationItem[] & GroupApplicationItem[];
  initial: string;
  key: string;
};

// props
defineProps<{
  goChatFun: (id: string, type: SessionType) => void;
}>();

// use
const contactsStore = useContactsStore();
const { t } = useI18n();
const sections = ref<string[]>();
const newFGArr = ref<newFGArrType[]>();
const type = ref<string>('');

// 分类
const sortData = () => {
  if (contactsStore.newFGList.length < 0) return;
  type.value = contactsStore.newFGList.type;
  const tmp: newFGArrType[] = [
    { initial: t('pending'), data: [], key: 'loading' },
    { initial: t('added'), data: [], key: 'over' },
    { initial: t('rejected'), data: [], key: 'refuse' },
  ];
  contactsStore.newFGList.data.forEach(
    (item: FriendApplicationItem & GroupApplicationItem) => {
      item.handleResult === 0
        ? tmp[0].data.push(item)
        : item.handleResult === 1
        ? tmp[1].data.push(item)
        : tmp[2].data.push(item);
    }
  );

  sections.value = tmp.map((sec) => sec.initial);

  newFGArr.value = tmp;

  return tmp;
};

onMounted(() => {
  sortData();
});

watch(
  [
    () => contactsStore.recvFriendApplicationList,
    () => contactsStore.sentFriendApplicationList,
    () => contactsStore.recvGroupApplicationList,
    () => contactsStore.sentGroupApplicationList,
  ],
  () => {
    sortData();
  }
);

watch(
  () => contactsStore.newFGList,
  () => {
    sortData();
  }
);
</script>

<style>
.new_g_new_f_c {
  color: var(--color-text);
  padding-top: 10px;
  margin-bottom: 20px;
}
.fg_list_c {
  display: flex;
  flex-wrap: wrap;
}
</style>

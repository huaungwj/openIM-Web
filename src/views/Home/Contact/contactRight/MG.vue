<template>
  <div class="my_group_c" v-if="groupListD">
    <!-- 列表 -->
    <div
      class="group_list"
      v-for="group in groupListD"
      :key="group.initial"
      :id="group.initial"
    >
      <!-- 头部锚点 -->
      <div class="sections_title">{{ group.initial }}</div>
      <!-- 内容区域 -->
      <main class="sections_c">
        <GroupItemComp
          v-for="item in group.data"
          :key="item.groupID"
          :item="item"
          :goChatFun="goChatFun"
        />

        <div class="sections_anchor_c">
          <ul>
            <li
              v-for="sec in sections"
              :key="sec"
              @click="clickAuthor(sec)"
              :class="regionActive === sec ? 'se_active' : ''"
            >
              {{ sec }}
            </li>
          </ul>
        </div>
      </main>
    </div>
  </div>
  <Empty
    v-else
    imgSrc="/src/assets/images/empty5.png"
    :width="270"
    :height="250"
  >
    <template #header>
      <p>暂无数据</p>
    </template>
  </Empty>
</template>

<script setup lang="ts">
import { ref, watch, defineProps } from 'vue';
import { useContactsStore } from '@/stores/contacts';
import { pySegSort } from '@/tools/tools';
import type { GroupItem } from '@/stores/types/contacts';
import GroupItemComp from '@/views/Home/Contact/contactRight/components/GroupItemComp.vue';
import Empty from '@/components/Empty/Empty.vue';
import type { SessionType } from '@/tools/im/constants/messageContentType';

type groupListType = {
  data: GroupItem[];
  initial: string;
};

//props
const props = defineProps<{
  goChatFun: (id: string, type: SessionType) => void;
}>();

const regionActive = ref<string>('');

// use
const contactsStore = useContactsStore();
// 锚点
const sections = ref<string[]>();
const groupListD = ref<groupListType[]>();

// 初始化群组列表
const initGroupList = () => {
  if (contactsStore.groupList.length === 0) return;
  const sortData: groupListType[] = pySegSort(
    contactsStore.groupList,
    'groupName'
  )?.segs;
  sections.value = sortData.map((sec) => sec.initial);
  // setCons(sortData);
  groupListD.value = sortData;
  regionActive.value = sortData[0]?.initial;
};

// 点击锚点
const clickAuthor = (id: string) => {
  const el = document.getElementById(id);
  el?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  console.log(el?.getBoundingClientRect());
  regionActive.value = id;
};

initGroupList();

watch(
  () => contactsStore.groupList,
  () => {
    initGroupList();
  }
);

console.log(pySegSort(contactsStore.groupList, 'groupName'));
</script>

<style></style>

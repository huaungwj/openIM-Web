<template>
  <div class="tc_mf_c" v-if="consList">
    <!-- 列表 -->
    <div
      class="contact_tc_mf_list"
      v-for="con in consList"
      :key="con.initial"
      :id="con.initial"
    >
      <!-- 头部锚点 -->
      <div class="sections_title">{{ con.initial }}</div>
      <!-- 内容区域 -->
      <main class="sections_c" v-if="con.data.length > 0">
        <SectionItemComp
          v-for="item in con.data"
          :key="item.userID"
          :item="item"
          :goChatFun="goChatFun"
        />
      </main>
    </div>
    <!-- 右边锚点 -->

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
import { defineProps } from 'vue';
import SectionItemComp from '@/views/Home/Contact/contactRight/components/SectionItemComp.vue';
import Empty from '@/components/Empty/Empty.vue';
import { useFriend } from '@/hooks/useFriend';

const props = defineProps<{ goChatFun: () => void }>();

// use
const { sections, consList, regionActive, initFriendList } = useFriend();
// 点击锚点
const clickAuthor = (id: string) => {
  const el = document.getElementById(id);
  el?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  // console.log(el?.getBoundingClientRect());
  regionActive.value = id;
};

initFriendList();
</script>

<style>
.tc_mf_c {
  position: relative;
}
.sections_title {
  color: var(--color-text);
  padding-top: 10px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 20px;
}
/* 内容卡片区域 */
.sections_c {
  display: flex;
  flex-wrap: wrap;
}

/* 锚点活跃状态 */
.sections_anchor_c .se_active {
  color: var(--im-theme-primary);
  background-color: #1f2a22;
  padding: 2px 8px;
}

.sections_anchor_c {
  position: fixed;
  right: 2%;
  top: 50%;
}

.sections_anchor_c > ul {
  padding-left: 0px;
}

.sections_anchor_c li {
  width: 40px;
  padding: 2px 8px;
  cursor: pointer;
  border-radius: 8px;
}
.sections_anchor_c li:hover {
  color: var(--im-theme-primary);
}
</style>

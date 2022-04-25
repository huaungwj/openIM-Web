<template>
  <div class="cve_container">
    <top-search />
    <n-spin size="small" :show="cveStore.cveInitLoading">
      <div class="cve_list" ref="cveItemRef" v-if="cveStore.cves.length > 0">
        <CveItem
          v-for="cve in cveStore.cves"
          :key="cve.userID && cve.groupID"
          :cve="cve"
          @contextmenu.prevent="openCveMenu($event, cve)"
        />
      </div>
      <Empty
        class="cve_list"
        v-else
        imgSrc="/src/assets/images/empty6.png"
        :width="200"
        :height="180"
      >
        <template #header>
          <p>暂无数据</p>
        </template>
      </Empty>
    </n-spin>

    <context-menu class="cve_menu" :offset="menuOffset">
      <template v-slot:menuItem>
        <li
          class="cve_menu_item"
          @click="pinnedCveFun(curClickCve.isPinned ? false : true)"
        >
          {{ curClickCve?.isPinned ? '取消置顶' : '置顶' }}
        </li>
        <li class="cve_menu_item" @click="markCveHasRead(curClickCve, 1)">
          标为已读
        </li>
        <li class="cve_menu_item" @click="seeDetailInfo">查看详细资料</li>

        <n-popconfirm
          @positive-click="delCve"
          positive-text="去意已决！"
          negative-text="朕，在想想~"
        >
          <template #trigger>
            <li class="cve_menu_item">移除会话</li>
          </template>
          确定要删除吗？聊天记录会丢失！
        </n-popconfirm>
      </template>
    </context-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { Ref } from 'vue';
import ContextMenu from '@/components/ContextMenu/ContextMenu.vue';
import TopSearch from '@/components/TopSearch/TopSearch.vue';
import CveItem from '@/views/Home/Cve/CveItem/CveItem.vue';
import Empty from '@/components/Empty/Empty.vue';
import { useCveStore } from '@/stores/cve';
import type { PinCveParams, ConversationItem } from '@/tools/im/types';
import { im } from '@/tools';
import { useMessage } from 'naive-ui';
import { markCveHasRead, isSingleCve } from '@/tools';
import { useMenu } from '@/hooks/useMenu';

const cveItemRef = ref<Ref>();
const cveStore = useCveStore();
const curClickCve = ref<ConversationItem>();
const { openMenu } = useMenu();
const message = useMessage();

const menuOffset = reactive({
  offsetLeft: 0,
  offsetWidth: 0,
  clientX: 0,
  clientY: 0,
});

// 置顶会话
const pinnedCveFun = (isPin: boolean) => {
  const options: PinCveParams = {
    conversationID: curClickCve.value!.conversationID,
    isPinned: isPin,
  };
  im.pinConversation(options)
    .then((res) => message.success(isPin ? '置顶成功' : '取消置顶成功'))
    .catch((err) => {
      message.error('操作失败，请稍后再试!');
    });
};

// 查看详细信息
const seeDetailInfo = () => {
  if (isSingleCve(curClickCve.value!)) {
    // 单会话
    cveStore.setFriIDCard(curClickCve.value?.userID);
    cveStore.setFriCardStatus(true);
  } else {
    // 群聊
    cveStore.setGroupCardStatus(true);
    cveStore.setGroupIDCard(curClickCve.value?.groupID);
  }
};

/**
 * 改变朋友、群组卡片模态框的状态
 * @param type
 */
const changeCardStatus = (type: boolean) => {
  if (cveStore.friendCardIsShow) {
    // 用户卡片为true说明当前在用user
    cveStore.setFriCardStatus(type);
  } else if (cveStore.groupCardIsShow) {
    cveStore.setGroupCardStatus(type);
  }
};

/**
 * 移除会话
 */
const delCve = () => {
  im.deleteConversation(curClickCve.value!.conversationID!)
    .then((res) => {
      const tarray = [...cveStore.cves];
      const farray = tarray.filter(
        (c) => c.conversationID !== curClickCve.value?.conversationID
      );

      console.log(farray);
      cveStore.setCveList(farray);
      if (cveStore.curCve.conversationID === curClickCve.value?.conversationID)
        return cveStore.setCurCve(null);
    })
    .catch((err) => message.error('操作失败，请稍后再试！'));
};

// context Menu
const openCveMenu = (e, cve: ConversationItem) => {
  curClickCve.value = cve;
  let offset = openMenu(e, cveItemRef);
  console.log(cveItemRef);
  menuOffset.clientX = offset.clientX;
  menuOffset.clientY = offset.clientY;
  menuOffset.offsetLeft = offset.offsetLeft;
  menuOffset.offsetWidth = offset.offsetWidth;
};
</script>

<style>
.cve_menu > .cve_menu_item {
  padding: 10px;
  text-align: center;
}
</style>

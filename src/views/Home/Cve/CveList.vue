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
        :imgSrc="Empty6"
        :width="200"
        :height="180"
      >
        <template #header>
          <p>{{ $t('emptyData') }}</p>
        </template>
      </Empty>
    </n-spin>

    <context-menu class="cve_menu" :offset="menuOffset">
      <template v-slot:menuItem>
        <li
          class="cve_menu_item"
          @click="pinnedCveFun(curClickCve.isPinned ? false : true)"
        >
          {{
            curClickCve?.isPinned ? $t('cve.cancelTopping') : $t('cve.topping')
          }}
        </li>
        <li class="cve_menu_item" @click="markCveHasRead(curClickCve, 1)">
          {{ $t('cve.markRead') }}
        </li>
        <li class="cve_menu_item" @click="seeDetailInfo">
          {{ $t('cve.viewDetails') }}
        </li>

        <n-popconfirm
          @positive-click="delCve"
          :positive-text="$t('ascertainText')"
          :negative-text="$t('cancelText')"
        >
          <template #trigger>
            <li class="cve_menu_item">{{ $t('cve.removeCve') }}</li>
          </template>
          {{ $t('cve.confirmDelText') }}
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
import Empty6 from '@/assets/images/empty6.png';
import { useCveStore } from '@/stores/cve';
import {
  type PinCveParams,
  type ConversationItem,
  OptType,
} from '@/tools/im/types';
import { im } from '@/tools';
import { useMessage } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { markCveHasRead, isSingleCve } from '@/tools';
import { useMenu } from '@/hooks/useMenu';

const cveItemRef = ref<Ref>();
const cveStore = useCveStore();
const curClickCve = ref<ConversationItem>({
  conversationID: '',
  conversationType: 0,
  userID: '',
  groupID: '',
  showName: '',
  faceURL: '',
  recvMsgOpt: OptType.Nomal,
  unreadCount: 0,
  groupAtType: 0,
  latestMsg: '',
  latestMsgSendTime: 0,
  draftText: '',
  draftTextTime: 0,
  isPinned: false,
  attachedInfo: '',
  ex: '',
});
const { openMenu } = useMenu();
const { t } = useI18n();
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
    conversationID: curClickCve.value.conversationID,
    isPinned: isPin,
  };
  im.pinConversation(options)
    .then(() =>
      message.success(isPin ? t('cve.topSuc') : t('cve.cancelTopSuc'))
    )
    .catch(() => {
      message.error(t('actionErrorText'));
    });
};

// 查看详细信息
const seeDetailInfo = () => {
  if (isSingleCve(curClickCve.value)) {
    // 单会话
    cveStore.setFriIDCard(curClickCve.value.userID);
    cveStore.setFriCardStatus(true);
  } else {
    // 群聊
    cveStore.setGroupCardStatus(true);
    cveStore.setGroupIDCard(curClickCve.value.groupID);
  }
};

/**
 * 移除会话
 */
const delCve = () => {
  im.deleteConversation(curClickCve.value.conversationID)
    .then(() => {
      const tarray = [...cveStore.cves];
      const farray = tarray.filter(
        (c) => c.conversationID !== curClickCve.value.conversationID
      );

      console.log(farray);
      cveStore.setCveList(farray);
      if (cveStore.curCve.conversationID === curClickCve.value.conversationID)
        return cveStore.setCurCve(null);
    })
    .catch(() => message.error(t('actionErrorText')));
};

// context Menu
const openCveMenu = (e: Event, cve: ConversationItem) => {
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

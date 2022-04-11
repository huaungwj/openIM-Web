<template>
  <div class="cve_container">
    <top-search />
    <n-spin size="small" :show="cveStore.cveInitLoading">
      <div class="cve_list" ref="cveItemRef">
        <CveItem
          v-for="cve in cveStore.cves"
          :key="cve.userID && cve.groupID"
          :cve="cve"
          @contextmenu.prevent="openMenu($event, cve)"
        />
      </div>
    </n-spin>

    <context-menu class="right-menu" :offset="menuOffset">
      <template v-slot:menuItem>
        <li>1232131</li>
        <li>1231232</li>
        <li>312333</li>
        <li>533333</li>
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
import { useCveStore } from '@/stores/cve';

const cveItemRef = ref<Ref>(null);
const cveStore = useCveStore();

const menuOffset = reactive({
  offsetLeft: 0,
  offsetWidth: 0,
  clientX: 0,
  clientY: 0,
});

// context Menu
const openMenu = (e, cve) => {
  console.log(cve);
  menuOffset.offsetLeft = cveItemRef.value.getBoundingClientRect().left; // container margin left
  menuOffset.offsetWidth = cveItemRef.value.offsetWidth; // container width
  menuOffset.clientX = e.clientX;
  menuOffset.clientY = e.clientY;
};
</script>

<style></style>

<template>
  <div class="cve_container">
    <top-search />
    <div class="cve_list">
      <CveItem />
      <CveItem />
      <CveItem />
      <CveItem />
      <CveItem />
      <CveItem />
      <CveItem />
      <CveItem />
      <CveItem />
      <CveItem />
      <CveItem />
    </div>
  </div>
</template>

<script setup lang="ts">
import TopSearch from '@/components/TopSearch/TopSearch.vue';
import CveItem from '@/views/Home/Cve/CveItem/CveItem.vue';
</script>

<style>
.cve_container {
  width: 435px;
  position: relative;
}

.cve_list {
  padding-top: 60px;
  width: 100%;
}
</style>

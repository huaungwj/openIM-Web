<template>
  <div class="top_search_container">
    <!-- search input -->
    <n-input placeholder="搜索" size="small">
      <template #prefix>
        <i class="iconfont openIM-search"></i>
      </template>
    </n-input>

    <!-- add button -->
    <i class="iconfont openIM-add add_button pointer"></i>
  </div>
</template>

<script lang="ts" setup></script>

<style>
.top_search_container {
  display: flex;
  align-items: center;
  width: 25.8%;
  background-color: var(--im-theme-topSearchBg) !important;
  z-index: 9999;
  padding: 10px;
  position: fixed;
}
.top_search_container > .add_button {
  font-size: 25px;
  padding-left: 10px;
}
</style>

<template>
  <div
    ref="chatInputRef"
    v-html="chatInputContext"
    class="chat_input"
    contenteditable
    placeholder="发送给小红"
    @input="changeChatInputContext"
  ></div>
</template>

<script lang="ts" setup>
const props = defineProps({
  chatInputContext: { type: String, required: true },
  changeChatInputContext: Function,
});
</script>

<style></style>
>

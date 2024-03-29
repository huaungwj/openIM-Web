<template>
  <component
    :is="tag"
    :contenteditable="contenteditable"
    @input="update"
    @blur="update"
    @paste="onPaste"
    @keypress="onKeypress"
    ref="element"
    class="editableDiv"
  >
  </component>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
function replaceAll(str: string, search: string, replacement: string) {
  return str.split(search).join(replacement);
}
export default defineComponent({
  props: {
    tag: String,
    contenteditable: {
      type: Boolean,
      default: true,
    },
    modelValue: String,
    noHTML: {
      type: Boolean,
      default: true,
    },
    noNL: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    returned: String,
    'update:modelValue': String,
  },
  setup(props, { emit }) {
    const element = ref<HTMLElement | null>(null);

    function currentContent() {
      return props.noHTML ? element.value!.innerText : element.value!.innerHTML;
    }
    function updateContent(newcontent: string) {
      if (props.noHTML) {
        element.value!.innerText = newcontent;
      } else {
        element.value!.innerHTML = newcontent;
      }
    }
    function update(event: Event) {
      emit('update:modelValue', currentContent());
    }
    function onPaste(event: ClipboardEvent) {
      event.preventDefault();
      let text = (event.originalEvent! || event).clipboardData.getData(
        'text/plain'
      );
      if (props.noNL) {
        text = replaceAll(text, '\r\n', ' ');
        text = replaceAll(text, '\n', ' ');
        text = replaceAll(text, '\r', ' ');
      }
      window.document.execCommand('insertText', false, text);
    }
    function onKeypress(event: KeyboardEvent) {
      if (event.shiftKey && event.key == 'Enter') {
        console.log('换行啦');
        return false;
      } else if (event.key == 'Enter' && props.noNL) {
        console.log('执行了');
        event.preventDefault();
        emit('returned', currentContent());
      }
    }

    onMounted(() => {
      updateContent(props.modelValue ?? '');
    });
    watch(
      () => props.modelValue,
      (newval) => {
        if (newval != currentContent()) {
          updateContent(newval ?? '');
        }
      }
    );
    return {
      update,
      onPaste,
      onKeypress,
      element,
    };
  },
});
</script>

<style scoped></style>

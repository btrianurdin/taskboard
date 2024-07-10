<template>
  <div :class="cn('border border-gray-300 rounded-md overflow-hidden')">
    <div class="w-full border-b bg-gray-50 p-2 flex gap-2">
      <button
        v-for="i in 6"
        :class="
          cn(
            'py-1 px-3 font-semibold',
            editor?.isActive('heading', { level: i }) &&
              '!bg-gray-300 rounded-md'
          )
        "
        @click="
          editor
            ?.chain()
            .focus()
            .toggleHeading({ level: i as any })
            .run()
        "
      >
        H{{ i }}
      </button>
      <button
        :class="
          cn(
            ' p-2 font-semibold',
            editor?.isActive('paragraph') && '!bg-gray-300 rounded-md'
          )
        "
        @click="editor?.chain().focus().setParagraph().run()"
      >
        Paragraph
      </button>
    </div>
    <TiptapEditorContent :editor="editor" />
  </div>
</template>
<script setup lang="ts">
import cn from "~/helpers/cn";

const props = defineProps<{
  modelValue: string;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const editor = useEditor({
  autofocus: true,
  extensions: [tiptapStarterKit],
  content: props.modelValue,
  editorProps: {
    attributes: {
      class: "task-description",
    },
  },
  onUpdate: (content) => {
    emits(
      "update:modelValue",
      editor.value?.isEmpty ? "" : content.editor.getHTML()
    );
  },
});

onBeforeUnmount(() => {
  unref(editor)?.destroy();
});
</script>
<style lang="postcss">
.tiptap {
  @apply p-3 min-h-[200px] w-full focus:outline-none;
}
</style>

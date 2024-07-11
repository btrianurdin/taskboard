<template>
  <div
    ref="formArea"
    :class="['flex gap-2 items-center px-1', isEditTitleMode && '!items-start']"
  >
    <UCheckbox v-model="checklistChecked" />
    <div
      v-if="!isEditTitleMode"
      class="flex items-center w-full hover:bg-gray-100 rounded-md px-1 py-1 group"
    >
      <p class="!text-base cursor-text w-full" @click="isEditTitleMode = true">
        {{ title }}
      </p>
      <UButton
        variant="ghost"
        size="sm"
        class="ml-auto opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white"
        @click="$emit('delete')"
      >
        <UIcon name="i-heroicons-trash" class="w-4 h-4" />
      </UButton>
    </div>
    <div v-if="isEditTitleMode" class="w-full flex flex-col gap-2">
      <UTextarea
        v-model="title"
        :rows="2"
        :ui="{ base: '!text-base' }"
        autoresize
        autofocus
      />
      <div class="flex gap-2">
        <UButton
          :disabled="!title.length"
          @click="
            {
              $emit('changeTitle', title);
              isEditTitleMode = false;
            }
          "
        >
          Save
        </UButton>
        <UButton
          variant="outline"
          @click="
            {
              title = props.checklist.title;
              isEditTitleMode = false;
            }
          "
        >
          Cancel
        </UButton>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import type { Checklist } from "~/types";

const props = defineProps<{
  checklist: Checklist;
}>();

const emits = defineEmits<{
  (e: "changeTitle", title: string): void;
  (e: "check", checked: boolean): void;
  (e: "delete"): void;
}>();

const formArea = ref<HTMLDivElement | null>(null);
const isEditTitleMode = ref<boolean>(false);
const title = ref<string>(props.checklist.title);
const checklistChecked = ref<boolean>(props.checklist.isChecked);

watch(
  () => props.checklist,
  (value) => {
    title.value = value.title;
    checklistChecked.value = value.isChecked;
  },
  {
    deep: true,
  }
);

watch(checklistChecked, (checked) => {
  emits("check", checked);
});

onClickOutside(formArea, () => {
  isEditTitleMode.value = false;
  title.value = props.checklist.title;
});
</script>

<template>
  <div
    ref="reference"
    :class="[
      'relative w-full p-3 bg-gray-100 rounded-md shadow text-left group flex-shrink-0',
    ]"
  >
    <p>{{ props.task.title }}</p>
    <button
      ref="editTriggerRef"
      class="absolute top-2 right-2 h-6 w-6 flex items-center justify-center rounded-full group-hover:bg-gray-200"
      @click="isEditMode = !isEditMode"
    >
      <UIcon name="i-heroicons-ellipsis-vertical" class="text-gray-900" />
    </button>

    <div
      id="editBox"
      ref="editBoxRef"
      v-if="isEditMode"
      :style="floatingStyles"
      :class="
        cn('w-[273px] z-[60] !-left-[21.5%]', isFlipped && '!left-[9.7%]')
      "
    >
      <div
        contenteditable
        ref="editInputRef"
        class="shadow-md rounded-md p-3 bg-white h-[70px] mb-2 focus-visible:outline-none"
      >
        {{ props.task.title }}
      </div>
      <UButton> Save </UButton>
    </div>
    <div
      ref="floating"
      v-if="isEditMode"
      :style="floatingStyles"
      class="z-[60]"
    >
      <div
        :class="[
          'flex flex-col justify-start items-start gap-3',
          isFlipped && '!items-end',
        ]"
      >
        <UButton color="white" icon="i-lucide-clipboard-list">
          Open card
        </UButton>
        <UButton color="white" icon="i-lucide-external-link">
          Visit Detail
        </UButton>
        <UButton color="red" icon="i-lucide-trash-2">Remove</UButton>
      </div>
    </div>

    <!-- overlay -->
    <div v-if="isEditMode" class="fixed inset-0 bg-black bg-opacity-50 z-50" />
  </div>
</template>
<script setup lang="ts">
import { flip, offset, useFloating } from "@floating-ui/vue";
import cn from "~/helpers/cn";
import type { Task } from "~/types";

const props = defineProps<{
  listId: string;
  task: Task;
}>();

const editTriggerRef = ref<HTMLButtonElement | null>(null);
const isEditMode = ref<boolean>(false);
const editBoxRef = ref<HTMLDivElement | null>(null);
const editInputRef = ref<HTMLDivElement | null>(null);

const reference = ref<HTMLDivElement | null>(null);
const floating = ref<HTMLDivElement | null>(null);

const { floatingStyles, middlewareData } = useFloating(reference, floating, {
  strategy: "fixed",
  placement: "right-start",
  middleware: [flip(), offset(10)],
});

watchEffect(() => {
  console.log(floatingStyles.value);
});

const isFlipped = computed(
  () => middlewareData.value.flip?.index !== undefined
);

watch(
  () => isEditMode.value,
  (value) => {
    if (value) {
      setTimeout(() => {
        editInputRef.value?.focus();
      }, 0);
    }
  }
);

const onClickOutside = (e: MouseEvent) => {
  if (isEditMode.value) {
    const target = e.target as HTMLElement;
    if (
      !editBoxRef.value?.contains(target) &&
      !editTriggerRef.value?.contains(target) &&
      !floating.value?.contains(target)
    ) {
      isEditMode.value = false;
    }
  }
};

onMounted(() => {
  document.addEventListener("click", onClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", onClickOutside);
});
</script>

<template>
  <div
    ref="reference"
    :class="[
      'relative w-full bg-gray-100 hover:bg-gray-200 hover:cursor-pointer rounded-md shadow text-left flex-shrink-0',
    ]"
  >
    <div class="p-3" @click="openTaskHandler">{{ props.task.title }}</div>
    <button
      ref="editTriggerRef"
      class="absolute top-2 right-2 h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-300"
      @click="isEditMode = !isEditMode"
    >
      <UIcon name="i-heroicons-ellipsis-vertical" class="text-gray-900" />
    </button>

    <!-- edit box -->
    <div
      id="editBox"
      ref="editBoxRef"
      v-if="isEditMode"
      :style="floatingStyles"
      :class="
        cn('w-[276px] z-[60] !-left-[286px]', isFlipped && '!left-[128px]')
      "
    >
      <UTextarea
        v-model="title"
        class="shadow-md rounded-md bg-white w-full resize-none mb-2"
        :ui="{ base: 'focus:!ring-0 !text-base !p-3' }"
        autoresize
        autofocus
      />

      <UButton
        @click="saveTitleHandler"
        :disabled="!title"
        class="disabled:bg-gray-800 disabled:!opacity-100"
      >
        Save
      </UButton>
    </div>

    <!-- floating action edit -->
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
        <UButton
          color="white"
          icon="i-lucide-clipboard-list"
          @click="editActionClick('open-card')"
        >
          Open card
        </UButton>
        <UButton color="white" icon="i-lucide-external-link">
          Visit Detail
        </UButton>
        <UButton color="white" icon="i-lucide-clock"> Add Date </UButton>
        <UButton
          color="red"
          icon="i-lucide-trash-2"
          @click="editActionClick('remove')"
        >
          Remove
        </UButton>
      </div>
    </div>

    <!-- overlay -->
    <div
      v-if="isEditMode"
      class="fixed inset-0 bg-gray-200/75 dark:bg-gray-800/75 z-50"
    />
  </div>
</template>
<script setup lang="ts">
import { flip, offset, useFloating } from "@floating-ui/vue";
import TaskModal from "~/components/TaskModal.vue";
import cn from "~/helpers/cn";
import useTodoStore from "~/store";
import type { Task } from "~/types";

const props = defineProps<{
  listId: string;
  task: Task;
}>();

const todoStore = useTodoStore();

const editTriggerRef = ref<HTMLButtonElement | null>(null);
const isEditMode = ref<boolean>(false);
const editBoxRef = ref<HTMLDivElement | null>(null);
const editInputRef = ref<HTMLDivElement | null>(null);
const title = ref(props.task.title);

// floating action edit
const reference = ref<HTMLDivElement | null>(null);
const floating = ref<HTMLDivElement | null>(null);

const { floatingStyles, middlewareData } = useFloating(reference, floating, {
  strategy: "fixed",
  placement: "right-start",
  middleware: [flip(), offset(10)],
});

const isFlipped = computed(
  () => middlewareData.value.flip?.index !== undefined
);

watch(
  () => isEditMode.value,
  (value) => {
    if (value) {
      title.value = props.task.title;
      setTimeout(() => {
        editInputRef.value?.focus();
      }, 0);
    }
  }
);

const saveTitleHandler = () => {
  todoStore.updateTaskTitle({
    listId: props.listId,
    taskId: props.task.id,
    title: title.value || "",
  });
  isEditMode.value = false;
};

const editActionClick = (action: "open-card" | "remove") => {
  if (action === "open-card") {
    modal.open(TaskModal, {
      listId: props.listId,
      task: props.task,
    });
    isEditMode.value = false;
  } else if (action === "remove") {
    todoStore.removeTask(props.listId, props.task.id);
    isEditMode.value = false;
  }
};

const modal = useModal();

const openTaskHandler = (e: Event) => {
  if (
    !isEditMode.value &&
    !editTriggerRef.value?.contains(e.target as HTMLElement)
  ) {
    modal.open(TaskModal, {
      listId: props.listId,
      task: props.task,
    });
  }
};

const onClickOutside = (e: MouseEvent) => {
  if (isEditMode.value) {
    const target = e.target as HTMLElement;
    if (
      !editBoxRef.value?.contains(target) &&
      !editTriggerRef.value?.contains(target) &&
      !floating.value?.contains(target)
    ) {
      isEditMode.value = false;
      title.value = props.task.title;
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

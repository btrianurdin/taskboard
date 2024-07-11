<template>
  <div class="relative w-[300px] h-auto flex-shrink-0">
    <!-- drag handle -->
    <button
      class="board-drag absolute left-1/2 -translate-x-1/2 -top-2 bg-white px-2 rounded-md flex cursor-grab"
    >
      <UIcon name="i-heroicons-bars-2-20-solid" class="text-gray-900 h-5 w-5" />
    </button>

    <div
      :class="[
        'w-full p-3 bg-white shadow-md rounded-md flex flex-col max-h-full',
        isNonEmptyArray(props.tasks) && 'gap-3',
      ]"
    >
      <!-- List Header -->
      <div ref="listTitleRef" class="mt-2 flex items-start justify-between">
        <UTextarea
          :rows="1"
          v-model="listTitle"
          @blur="updateTitleHandler"
          class="w-full"
          :ui="{
            strategy: 'override',
            base: '!text-base w-full border-0 ring-0 shadow-none focus:ring-2',
          }"
          autoresize
        />
        <UDropdown
          :items="[
            [
              {
                label: 'Edit',
                click: editClickHandler,
              },
              {
                label: 'Delete',
                class: 'text-red-600',
                click: () => todoStore.deleteBoardList(props.id),
              },
            ],
          ]"
          :popper="{ placement: 'bottom-start' }"
        >
          <UButton
            variant="ghost"
            trailing-icon="i-heroicons-ellipsis-horizontal"
          />
        </UDropdown>
      </div>

      <!-- List Items -->
      <draggable
        :list="props.tasks"
        :group="props.group"
        class="flex flex-col gap-3 overflow-auto"
        item-key="id"
        :animation="100"
        ghostClass="l-item-ghost"
        @change="todoStore.storageUpdate"
      >
        <template #item="{ element: task }">
          <TaskItem :listId="props.id" :task="task" />
        </template>
      </draggable>

      <!-- List Footer / Add new task -->
      <button
        v-if="!isAddMode"
        class="hover:bg-gray-100 transition w-full text-left rounded-md flex items-center gap-1 p-2"
        @click="isAddMode = true"
      >
        <UIcon name="i-heroicons-plus" class="text-black" />
        Add Task
      </button>
      <div ref="addTaskArea" v-else class="flex flex-col gap-2">
        <UTextarea
          id="taskTitle"
          ref="inputRef"
          :rows="1"
          v-model="taskTitle"
          autoresize
          autofocus
        />
        <div class="flex gap-2">
          <UButton :disabled="!taskTitle" @click="addTaskHandler">
            Save
          </UButton>
          <UButton variant="outline" @click="isAddMode = false">
            Cancel
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import draggable from "vuedraggable";
import { isNonEmptyArray } from "~/helpers/array-fn";
import createId from "~/helpers/create-id";
import useTodoStore from "~/store";
import type { Task } from "~/types";

const props = defineProps<{
  id: string;
  title: string;
  tasks: Task[];
  group: string;
}>();

const todoStore = useTodoStore();

const listTitleRef = ref<HTMLDivElement | null>(null);
const listTitle = ref<string>(props.title);

const updateTitleHandler = () => {
  todoStore.updateBoardList({
    id: props.id,
    title: listTitle.value,
  });
};

const editClickHandler = () => {
  listTitleRef.value?.querySelector("textarea")?.focus();
};

const addTaskArea = ref<HTMLDivElement | null>(null);
const isAddMode = ref<boolean>(false);
const taskTitle = ref<string>("");

const addTaskHandler = () => {
  todoStore.addTask({
    listId: props.id,
    id: createId(8),
    title: taskTitle.value,
  });

  taskTitle.value = "";
  isAddMode.value = false;
};

onClickOutside(addTaskArea, () => {
  isAddMode.value = false;
});
</script>

<style scoped lang="postcss">
.l-item-ghost {
  @apply bg-gray-300 text-gray-300;
}
</style>

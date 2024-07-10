<template>
  <div class="relative w-[300px] h-auto flex-shrink-0">
    <div
      class="w-full p-3 bg-white shadow-md rounded-md flex gap-3 flex-col max-h-full"
    >
      <!-- List Header -->
      <div class="cursor-text">
        <UTextarea
          v-if="isListTitleEditMode"
          ref="inputRef"
          :rows="1"
          v-model="listTitle"
          @blur="updateList"
          class="mb-2"
          :ui="{ base: '!text-base' }"
          autoresize
          autofocus
        />
        <h2 v-else class="font-medium" @click="isListTitleEditMode = true">
          {{ props.title }}
        </h2>
      </div>

      <!-- List Items -->
      <draggable
        :list="props.list"
        :group="props.group"
        class="flex flex-col gap-3 overflow-auto"
        item-key="id"
        :animation="300"
        @change="todoStore.storageUpdate"
      >
        <template #item="{ element: task }">
          <BoardListItem :listId="props.id" :task="task" />
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
      <div v-else class="flex flex-col gap-2">
        <UTextarea
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
import draggable from "vuedraggable";
import BoardListItem from "~/components/BoardListItem.vue";
import createId from "~/helpers/create-id";
import useTodoStore from "~/store";
import type { Task } from "~/types";

const props = defineProps<{
  id: string;
  title: string;
  list: Task[];
  group: string;
}>();

const todoStore = useTodoStore();

const isListTitleEditMode = ref<boolean>(false);
const listTitle = ref<string>(props.title);

const updateList = () => {
  todoStore.updateBoardList({
    id: props.id,
    title: listTitle.value,
  });
  isListTitleEditMode.value = false;
};

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
</script>

<style scoped lang="postcss">
.sortable-ghost {
  @apply bg-gray-300 text-gray-300;
}
.sortable-drag {
  @apply bg-gray-100;
}
</style>

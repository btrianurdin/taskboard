<template>
  <div class="relative w-[300px] h-auto flex-shrink-0">
    <div class="w-full p-3 bg-white shadow-md rounded-md flex gap-3 flex-col max-h-full">
      <h2 class="font-medium">{{ props.title }}</h2>
      <draggable
        v-if="!isEmptyArray(props.list)"
        :list="props.list"
        :group="props.group"
        class="flex flex-col gap-3 overflow-auto"
        item-key="id"
        :animation="300"
      >
        <template #item="{ element: task }">
          <button class="w-full p-3 bg-gray-100 rounded-md shadow text-left">
            <h3 class="title">{{ task.title }}</h3>
          </button>
        </template>
      </draggable>
      <button
        v-if="!isAddMode"
        class="hover:bg-gray-100 transition w-full text-left rounded-md flex items-center gap-1 p-2"
        @click="isAddMode = true"
      >
        <UIcon name="i-heroicons-plus" class="text-black" />
        Add Task
      </button>
      <div v-if="isAddMode" class="flex flex-col gap-2">
        <UInput ref="inputRef" v-model="taskTitle" autofocus />
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
import { isEmptyArray } from "~/helpers/array-fn";
import createId from "~/helpers/create-id";
import type { Task } from "~/types";

const props = defineProps<{
  title: string;
  list: Task[];
  group: string;
}>();

const isAddMode = ref<boolean>(false);
const taskTitle = ref<string>("");

const emits = defineEmits<{
  (e: "addTask", data: { id: string; title: string }): void;
}>();

const addTaskHandler = () => {
  emits("addTask", {
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

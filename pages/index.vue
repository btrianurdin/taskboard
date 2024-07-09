<template>
  <div class="h-full p-6 w-full">
    <div
      v-if="todoStore.status === 'loading'"
      class="h-full w-full flex items-center justify-center gap-2"
    >
      <UIcon name="i-lucide-loader" class="w-6 h-6 animate-spin" />
      <p>Loading...</p>
    </div>
    <div
      v-if="todoStore.status === 'ready'"
      class="h-full flex gap-6"
    >
      <template v-for="board in todoStore.boardLists">
        <BoardList
          group="mytodo"
          :title="board.title"
          :list="board.tasks"
          @add-task="(data) => addTaskHandler({ listId: board.id, ...data })"
        />
      </template>
      <div class="bg-white w-[300px] flex-shrink-0 shadow-md rounded-md">
        <button
          v-if="!isAddMode"
          class="w-full p-3 flex items-center justify-center gap-2 hover:bg-gray-100 transition"
          @click="isAddMode = true"
        >
          <UIcon name="i-heroicons-plus" class="text-black" />
          Add New List
        </button>
        <div v-if="isAddMode" class="p-3 flex flex-col gap-2">
          <UInput ref="inputRef" v-model="listName" autofocus />
          <div class="flex gap-2">
            <UButton :disabled="!listName" @click="addListHandler">
              Save
            </UButton>
            <UButton variant="outline" @click="isAddMode = false">
              Cancel
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import createId from "~/helpers/create-id";
import useTodoStore from "~/store";
import type { AddTask } from "~/types";

const todoStore = useTodoStore();

const isAddMode = ref<boolean>(false);

const inputRef = ref<HTMLInputElement | null>(null);
const listName = ref<string>("");

const addListHandler = () => {
  todoStore.addBordLists({
    id: createId(8),
    title: listName.value,
  });
  listName.value = "";
  isAddMode.value = false;
};

const addTaskHandler = (data: AddTask) => todoStore.addTask(data);
</script>

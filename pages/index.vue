<template>
  <div class="h-full w-full">
    <div
      v-if="todoStore.status === 'loading'"
      class="h-full w-full flex items-center justify-center gap-2"
    >
      <UIcon name="i-lucide-loader" class="w-6 h-6 animate-spin" />
      <p>Loading...</p>
    </div>
    <div
      v-if="todoStore.status === 'ready'"
      class="h-full flex gap-6 overflow-x-auto p-6"
    >
      <draggable
        :list="todoStore.boardLists"
        group="board-lists"
        class="flex gap-6 relative"
        item-key="id"
        :animation="100"
        handle=".board-drag"
        @change="todoStore.storageUpdate"
      >
        <template #item="{ element: lists }">
          <BoardList
            group="mytodo"
            :id="lists.id"
            :title="lists.title"
            :tasks="lists.tasks"
          />
        </template>
      </draggable>
      <div
        ref="addModeArea"
        class="self-start bg-white w-[300px] flex-shrink-0 shadow-md rounded-md"
      >
        <button
          v-if="!isAddMode"
          class="w-full p-3 flex items-center justify-center gap-2 hover:bg-gray-100 transition"
          @click="isAddMode = true"
        >
          <UIcon name="i-heroicons-plus" class="text-black" />
          Add New List
        </button>
        <div v-if="isAddMode" class="p-3 flex flex-col gap-2">
          <UTextarea
            ref="inputRef"
            v-model="listName"
            :rows="1"
            autoresize
            autofocus
          />
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
import draggable from "vuedraggable";
import { onClickOutside } from "@vueuse/core";
import createId from "~/helpers/create-id";
import useTodoStore from "~/store";

const todoStore = useTodoStore();

const addModeArea = ref<HTMLDivElement | null>(null);
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

onClickOutside(addModeArea, () => {
  isAddMode.value = false;
});
</script>
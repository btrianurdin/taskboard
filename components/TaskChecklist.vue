<template>
  <div class="p-3">
    <p class="text-lg font-medium text-black flex items-center gap-3 mb-3">
      <UIcon name="i-lucide-copy-check" />
      Checklist
    </p>
    <div>
      <ul
        class="mb-4 flex flex-col gap-2"
        v-if="isNonEmptyArray(props?.checklists)"
      >
        <li v-for="checklist in props.checklists">
          <TaskChecklistItem
            :checklist="checklist"
            @change-title="
              (title) => updateChecklistHandler('title', checklist.id, title)
            "
            @check="
              (checked) =>
                updateChecklistHandler('isChecked', checklist.id, checked)
            "
            @delete="
              todoStore.updateTaskChecklist({
                action: 'delete',
                listId: props.listId,
                taskId: props.taskId,
                checklistId: checklist.id,
              })
            "
          />
        </li>
      </ul>
      <div class="px-7">
        <div ref="formArea" v-if="isAddMode" class="flex flex-col gap-3">
          <UTextarea
            v-model="checklistTitle"
            :ui="{ base: '!text-base' }"
            :rows="1"
            @click="isAddMode = true"
            autoresize
            placeholder="Add an item"
            autofocus
          />
          <div class="flex gap-2">
            <UButton
              :disabled="!checklistTitle.length"
              @click="addChecklistHandler"
            >
              Add
            </UButton>
            <UButton variant="outline" @click="isAddMode = false">
              Cancel
            </UButton>
          </div>
        </div>
        <UButton v-else @click="isAddMode = true">
          <UIcon name="i-heroicons-plus" class="w-5 h-5" />
          Add an item
        </UButton>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { isNonEmptyArray } from "~/helpers/array-fn";
import createId from "~/helpers/create-id";
import useTodoStore from "~/store";
import type { Checklist } from "~/types";

const props = defineProps<{
  listId: string;
  taskId: string;
  checklists: Checklist[];
}>();

const todoStore = useTodoStore();

const formArea = ref<HTMLDivElement | null>(null);
const isAddMode = ref<boolean>(false);
const checklistTitle = ref<string>("");

const addChecklistHandler = () => {
  todoStore.addTaskChecklist({
    listId: props.listId,
    taskId: props.taskId,
    checklistId: createId(10),
    title: checklistTitle.value,
  });
  checklistTitle.value = "";
  isAddMode.value = false;
};

const updateChecklistHandler = (
  type: "title" | "isChecked",
  checklistId: string,
  value: any
) => {
  todoStore.updateTaskChecklist({
    action: "update",
    listId: props.listId,
    taskId: props.taskId,
    checklistId,
    data: { [type]: value },
  });
};

onClickOutside(formArea, () => (isAddMode.value = false));
</script>

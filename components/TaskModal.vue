<template>
  <UModal :ui="{ base: 'sm:!max-w-3xl min-h-[450px] w-full h-full' }">
    <div class="p-3 flex flex-col">
      <input class="sr-only"  />
      <UTextarea
        :ui="{
          strategy: 'override',
          base: '!text-2xl !font-semibold w-full p-0 p-4 border-0 ring-0 shadow-none focus:ring-2',
        }"
        :rows="1"
        @click="editTitle = true"
        autoresize
        @blur="
          todoStore.updateTaskTitle({ listId: listId, taskId: task.id, title })
          "
        :autofocus="false"
        v-model="title"
      />
      <div class="p-3">
        <div class="flex justify-between items-center mb-4">
          <p class="text-lg font-medium text-black flex items-center gap-1">
            <UIcon name="i-lucide-text-quote" />
            Decsription
          </p>
          <UButton
            v-if="!showEditor && !!description"
            @click="showEditor = true"
          >
            Edit
          </UButton>
        </div>
        <div>
          <div v-if="!!description && !showEditor">
            <div
              class="task-description cursor-pointer"
              v-html="description"
              @click="showEditor = true"
            ></div>
          </div>
          <button
            v-if="!description && !showEditor"
            class="p-4 bg-gray-100 rounded-md hover:bg-gray-200 w-full text-left focus:outline-none"
            @click="showEditor = true"
          >
            <p>Add any descriptions to your task.</p>
          </button>
          <div v-if="showEditor">
            <TextEditor v-model="description" />
            <div class="mt-3 flex gap-3">
              <UButton @click="saveHandler"> Save </UButton>
              <UButton variant="outline" @click="cancelHandler">
                Cancel
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UModal>
</template>
<script setup lang="ts">
import useTodoStore from "~/store";
import type { Task } from "~/types";

const props = defineProps<{
  listId: string;
  task: Task;
}>();

const editTitle = ref<boolean>(false);
const title = ref<string>(props.task.title);

const showEditor = ref<boolean>(false);
const description = ref<string>(props.task.description);

const todoStore = useTodoStore();

const saveHandler = () => {
  todoStore.updateTaskDescription({
    listId: props.listId,
    taskId: props.task.id,
    description: description.value,
  });
  showEditor.value = false;
};

const cancelHandler = () => {
  showEditor.value = false;
  description.value = props.task.description;
};
</script>

<template>
  <div class="p-3 mb-2">
    <div class="flex justify-between items-center mb-4">
      <p class="text-lg font-medium text-black flex items-center gap-3">
        <UIcon name="i-lucide-text-quote" />
        Decsription
      </p>
      <UButton v-if="!showEditor && !!description" @click="showEditor = true">
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
          <UButton variant="outline" @click="cancelHandler"> Cancel </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import useTodoStore from "~/store";

const props = defineProps<{
  listId: string;
  taskId: string;
  description: string;
}>();

const showEditor = ref<boolean>(false);
const description = ref<string>(props.description);

const todoStore = useTodoStore();

const saveHandler = () => {
  todoStore.updateTaskDescription({
    listId: props.listId,
    taskId: props.taskId,
    description: description.value,
  });
  showEditor.value = false;
};

const cancelHandler = () => {
  showEditor.value = false;
  description.value = props.description;
};
</script>

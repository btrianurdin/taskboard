<template>
  <UModal :ui="{ base: 'sm:!max-w-3xl min-h-[450px] w-full h-full' }">
    <div class="p-3 flex flex-col">
      <input class="sr-only" />
      <UTextarea
        :ui="{
          strategy: 'override',
          base: '!text-2xl !font-semibold w-full p-0 p-4 border-0 ring-0 shadow-none focus:ring-2',
        }"
        :rows="1"
        autoresize
        @blur="
          todoStore.updateTaskTitle({ listId: listId, taskId: task.id, title })
        "
        :autofocus="false"
        v-model="title"
      />
      <TaskDescription
        :listId="listId"
        :taskId="task.id"
        :description="task.description"
      />
      <TaskChecklist
        :listId="listId"
        :taskId="task.id"
        :checklists="task.checklists || []"
      />
      <div class="p-3">
        <p class="text-lg font-medium text-black flex items-center gap-1 mb-3">
          <UIcon name="i-lucide-clock" />
          Dates
        </p>
        <div class="">
          <UButton> Add a due date </UButton>
        </div>
      </div>
    </div>
  </UModal>
</template>
<script setup lang="ts">
import TaskChecklist from "~/components/TaskChecklist.vue";
import useTodoStore from "~/store";
import type { Task } from "~/types";

const props = defineProps<{
  listId: string;
  task: Task;
}>();

const title = ref<string>(props.task.title);

const todoStore = useTodoStore();
</script>

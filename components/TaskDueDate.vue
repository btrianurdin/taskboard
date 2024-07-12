<template>
  <div class="p-3">
    <p class="text-lg font-medium text-black flex items-center gap-3 mb-3">
      <UIcon name="i-lucide-clock" />
      Dates
    </p>
    <div class="px-7 flex items-center">
      <p class="text-base" v-if="dueDate">{{ printDueDate }}</p>
      <UPopover
        v-model:open="selectDateOpen"
        :popper="{ placement: 'right-start', strategy: 'fixed' }"
        :ui="{ trigger: 'w-auto' }"
      >
        <UButton v-if="!dueDate"> Add a due date </UButton>
        <UButton v-else variant="ghost" class="hover:bg-gray-100 ml-3">
          <UIcon name="i-lucide-pencil-line" class="w-5 h-5" />
        </UButton>
        <template #panel="{ close }">
          <div class="p-2 w-[300px] relative">
            <div class="p-2 mb-3 relative">
              <p class="text-center text-lg font-semibold">Select Dates</p>
              <button
                class="absolute top-2.5 right-2.5 p-0.5 flex hover:bg-gray-200 rounded-full"
                @click="close"
              >
                <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
              </button>
            </div>
            <DatePicker
              v-model="date"
              is-required
              is-range-date
              is24hr
              expanded
            />
            <div class="p-2 pt-0 flex flex-col gap-4">
              <div class="w-[47%]">
                <p class="mb-1">Start Date</p>
                <UInput v-model="startDate" />
              </div>
              <div class="flex gap-3">
                <div>
                  <p class="mb-1">End Date</p>
                  <UInput v-model="endDate" />
                </div>
                <div>
                  <p class="mb-1">Time</p>
                  <Floating placement="top">
                    <UInput v-model="endTime" />
                    <template #panel>
                      <DatePicker
                        v-model="time"
                        mode="time"
                        is24hr
                        hide-time-header
                      />
                    </template>
                  </Floating>
                </div>
              </div>
            </div>
            <div class="px-2 flex mt-3 gap-2 justify-end">
              <UButton
                v-if="props.dueDate"
                color="red"
                @click="
                  {
                    todoStore.deleteTaskDueDate(props.listId, props.taskId);
                    close();
                  }
                "
              >
                Delete
              </UButton>
              <UButton @click="saveHandler"> Save </UButton>
              <UButton variant="outline" @click="close"> Cancel </UButton>
            </div>
          </div>
        </template>
      </UPopover>
    </div>
  </div>
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import DatePicker from "~/components/ui/DatePicker.vue";
import Floating from "~/components/ui/Floating.vue";
import useTodoStore from "~/store";

const props = defineProps<{
  listId: string;
  taskId: string;
  dueDate?: {
    start: string;
    end: string;
  };
}>();

// time edit
const time = ref<Date>(dayjs().toDate());
const endTime = computed(() => dayjs(time.value).format("HH:mm"));

// date edit
const defaultDate = {
  start: dayjs().toISOString(),
  end: dayjs().add(1, "day").toISOString(),
};

const date = ref<{ start: string; end: string }>(props.dueDate || defaultDate);
const selectDateOpen = ref<boolean>(false);

watch(
  () => props.dueDate,
  (value) => {
    if (value) {
      date.value = value;
    }
  },
  {
    deep: true,
  }
);

const startDate = computed({
  get: () => dayjs(date.value.start).format("DD MMM YYYY"),
  set: (value) => {
    date.value.start = dayjs(value).toISOString();
  },
});

const endDate = computed({
  get: () => dayjs(date.value.end).format("DD MMM YYYY"),
  set: (value) => {
    date.value.end = dayjs(value).toISOString();
  },
});

const todoStore = useTodoStore();

const saveHandler = () => {
  const startDate = dayjs(date.value.start).toISOString();
  const endDate = dayjs(date.value.end)
    .set("hour", dayjs(time.value).hour())
    .set("minute", dayjs(time.value).minute())
    .toISOString();

  todoStore.updateTaskDueDate({
    listId: props.listId,
    taskId: props.taskId,
    date: {
      start: startDate,
      end: endDate,
    },
  });
  selectDateOpen.value = false;
};

watch(
  () => selectDateOpen.value,
  (value) => {
    if (!value) {
      date.value = props.dueDate || defaultDate;
    }
  }
);

const printDueDate = computed(() => {
  if (!props.dueDate) return "";
  const start = dayjs(props.dueDate.start).format("DD MMM YYYY");
  const end = dayjs(props.dueDate.end).format("DD MMM YYYY");
  const time = dayjs(props.dueDate.end).format("HH:mm");
  return `${start} - ${end}, ${time}`;
});
</script>
<style>
.vc-time-select-group {
  @apply bg-transparent border-0;
}
.vc-time-picker {
  padding: 4px 8px !important;
}
</style>

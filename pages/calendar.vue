<template>
  <div class="bg-white flex h-full w-full">
    <div class="w-[25%] p-4 h-full border-r">
      <p class="text-lg font-medium mb-4">Task Lists</p>
      <p class="mb-3 text-base">
        {{
          dayjs(selectedDate).isSame(dayjs(), "day")
            ? "Task Today"
            : "Task at " + dayjs(selectedDate).format("DD MMMM YYYY")
        }}
      </p>
      <div class="flex flex-col gap-3">
        <div v-if="isEmptyArray(detail)">
          <p class="text-lg text-gray-400 text-center my-10">No task</p>
        </div>
        <div
          v-for="task in detail"
          :key="task.id"
          class="flex gap-3 p-3 rounded-md hover:bg-gray-100"
        >
          <div class="w-3 h-3 mt-2 rounded-full bg-black flex-shrink-0"></div>
          <div class="flex flex-col gap-3 w-full">
            <p class="text-lg">{{ task.title }}</p>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-clock" />
              <p class="text-sm">
                {{ dayjs(task.dueDate?.start).format("DD MMM YYYY") }}
                -
                {{ dayjs(task.dueDate?.end).format("DD MMM YYYY") }},
                {{ dayjs(task.dueDate?.end).format("HH:mm") }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-[75%] p-6 h-full overflow-y-auto">
      <FullCalendar ref="calendarRef" :options="options" />
    </div>
  </div>
</template>
<script setup lang="ts">
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import Interaction from "@fullcalendar/interaction";
import useTodoStore from "~/store";
import type {
  CalendarOptions,
  EventSourceInput,
  CalendarApi,
} from "@fullcalendar/core/index.js";
import type { Task } from "~/types";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { isEmptyArray } from "~/helpers/array-fn";
import TaskModal from "~/components/TaskModal.vue";

dayjs.extend(isBetween);

const todo = useTodoStore();
const calendarRef = ref<any>(null);
const calendarApi = computed(() => calendarRef.value?.getApi() as CalendarApi);
const detail = ref<Task[]>([]);
const selectedDate = ref<Date>(dayjs().toDate());

const events = computed(() => {
  return todo.taskHasDueDate.map((task) => ({
    listId: task.listId,
    id: task.id,
    title: task.title,
    start: task.dueDate?.start,
    end: task.dueDate?.end,
    backgroundColor: "#000",
  }));
});

const modal = useModal();

const options: CalendarOptions = {
  plugins: [dayGridPlugin, Interaction],
  initialView: "dayGridMonth",
  timeZone: "local",
  firstDay: 1,
  eventTimeFormat: {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "local",
    hour12: false,
  },
  headerToolbar: {
    right: "today prev,next",
    left: "title",
    center: undefined,
  },
  selectable: true,
  eventContent(renderProps, createElement) {
    return createElement(
      "div",
      {
        style: {
          backgroundColor: renderProps.backgroundColor,
        },
        class:
          "border-none rounded-md p-1 text-center text-white text-sm cursor-pointer transition-all duration-300",
      },
      `${renderProps.event.title}`
    );
  },
  eventMouseEnter(info) {
    info.event.setProp("backgroundColor", "#9ca3af");
  },
  eventMouseLeave(info) {
    info.event.setProp("backgroundColor", "#000");
  },
  eventClick(info) {
    const listId = info.event.extendedProps?.listId;
    if (!listId) return;
    const task = todo.getTaskById(listId, info.event.id) as Task;
    if (task) {
      modal.open(TaskModal, {
        listId,
        task,
      });
    }
  },
  dateClick(info) {
    selectedDate.value = info.date;
  },
};

watch(
  [() => events.value, () => calendarApi.value],
  () => {
    if (calendarApi.value && events.value) {
      calendarApi.value.removeAllEventSources();
      calendarApi.value.addEventSource(events.value as EventSourceInput);
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

const taskToday = computed(() => {
  return todo.taskHasDueDate.filter((task) => {
    const start = dayjs(task.dueDate?.start);
    const end = dayjs(task.dueDate?.end);
    return dayjs().isBetween(start, end, "day", "[]");
  });
});

watchEffect(() => {
  if (selectedDate.value) {
    detail.value = todo.getTaskByDate(selectedDate.value);
  } else {
    detail.value = taskToday.value;
  }
});
</script>
<style lang="postcss">
.fc .fc-button {
  @apply bg-black hover:bg-black border-0 focus:shadow-none disabled:!bg-gray-400 opacity-100 disabled:cursor-not-allowed;
}
.fc-toolbar-title {
  @apply font-dm-sans;
}
.fc .fc-daygrid-day.fc-day-today {
  @apply bg-gray-200;
}
.fc .fc-h-event {
  @apply border-none bg-transparent;
}
.fc .fc-day {
  @apply hover:bg-gray-100;
}
</style>

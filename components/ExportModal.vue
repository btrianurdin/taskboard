<template>
  <UModal :ui="{ base: 'sm:!max-w-sm' }">
    <div class="p-6 flex flex-col gap-5">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">Export Data</h2>
        <UButton
          variant="ghost"
          class="hover:bg-gray-200"
          @click="emits('close')"
        >
          <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
        </UButton>
      </div>
      <div>
        <div class="mb-5">
          <label class="block text-sm font-medium mb-1">File Name</label>
          <UInput v-model="fileName" />
        </div>
        <UButton
          class="justify-center w-full"
          @click="exportHandler"
          :loading="loading"
          :disabled="!fileName"
        >
          Export
        </UButton>
      </div>
    </div>
  </UModal>
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import useTodoStore from "~/store";

const emits = defineEmits<{
  (e: "close"): void;
}>();

const fileName = ref<string>("Taskboard-" + dayjs().unix());
const loading = ref(false);
const todoStore = useTodoStore();
const toast = useToast();

const exportHandler = async () => {
  loading.value = true;
  const data = await todoStore.exportData();
  const blob = new Blob([data], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName.value + ".json";
  a.click();
  URL.revokeObjectURL(url);
  toast.add({
    title: "Data exported successfully",
    description: "Your data has been exported successfully",
  });
  loading.value = false;
  emits("close");
};
</script>

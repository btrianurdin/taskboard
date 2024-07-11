<template>
  <UModal :ui="{ base: 'sm:!max-w-sm' }">
    <div class="p-6 flex flex-col gap-5">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">Import Data</h2>
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
          <label class="block text-sm font-medium mb-1">Choose File</label>
          <UInput
            type="file"
            @change="fileChangeHandler"
            accept="application/json"
          />
        </div>
        <UButton class="justify-center w-full" @click="importHandler">
          Import
        </UButton>
      </div>
    </div>
  </UModal>
</template>
<script setup lang="ts">
import isValidTaskboardApp from "~/helpers/is-valid-taskboard-app";
import useTodoStore from "~/store";

const emits = defineEmits<{
  (e: "close"): void;
}>();

const exportFile = ref<File | null>(null);

const fileChangeHandler = (file: FileList) => {
  if (file?.[0]) {
    exportFile.value = file[0] as File;
  }
};

const toast = useToast();
const todoStore = useTodoStore();

const importHandler = () => {
  if (exportFile.value) {
    const reader = new FileReader();
    reader.onload = async () => {
      const data = reader.result as string;
      const parsedData = JSON.parse(data);
      const isValid = isValidTaskboardApp(parsedData, "1.0");
      if (!isValid) {
        toast.add({
          title: "Invalid Data",
          description: "The data is invalid or empty",
          color: "red",
        });
        return;
      }
      todoStore.importData(parsedData);
      toast.add({
        title: "Data imported successfully",
        description: "Your data has been imported successfully",
      });
      emits("close");
    };
    reader.readAsText(exportFile.value);
  }
};
</script>

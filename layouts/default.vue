<template>
  <div class="h-screen w-screen flex flex-col">
    <header
      class="relative bg-white px-6 pt-6 border-b flex-shrink-0 flex flex-col gap-4 items-center justify-center"
    >
      <div class="relative w-full">
        <h1 class="text-xl font-semibold text-center">Taskboard</h1>
        <div class="absolute top-1/2 -translate-y-1/2 right-0 flex gap-3">
          <UButton
            variant="ghost"
            class="hover:bg-gray-200"
            @click="sourceHandler('import')"
          >
            <UIcon name="i-lucide-cloud-download" />
            Import
          </UButton>
          <UButton
            variant="ghost"
            class="hover:bg-gray-200"
            @click="sourceHandler('export')"
          >
            <UIcon name="i-lucide-cloud-upload" />
            Export
          </UButton>
        </div>
      </div>
      <div class="relative flex gap-6">
        <NuxtLink v-for="item in menuItems" :to="item.href" class="px-3 py-2">
          {{ item.label }}
        </NuxtLink>
        <div
          :class="[
            'absolute bottom-0 h-1 w-[68px] bg-black rounded-t -left-0 transition-all duration-300',
            $route.path === '/calendar' && '!w-[90px] !left-[92px]',
          ]"
        />
      </div>
    </header>
    <div class="h-full w-full overflow-y-hidden">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
import ExportModal from "~/components/ExportModal.vue";
import ImportModal from "~/components/ImportModal.vue";

type MenuItemsType = {
  label: string;
  href: string;
};

const menuItems: MenuItemsType[] = [
  {
    label: "Board",
    href: "/",
  },
  {
    label: "Calendar",
    href: "/calendar",
  },
];

const modal = useModal();

const sourceHandler = (type: "import" | "export") => {
  if (type === "import") {
    modal.open(ImportModal, {
      onClose: () => modal.close(),
    });
  } else {
    modal.open(ExportModal, {
      onClose: () => modal.close(),
    });
  }
};
</script>

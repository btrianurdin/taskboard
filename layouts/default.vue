<template>
  <div class="h-screen w-screen flex flex-col">
    <header
      class="bg-white px-6 pt-6 border-b flex-shrink-0 flex flex-col gap-4 items-center justify-center"
    >
      <h1 class="text-xl font-semibold text-center">Taskboard</h1>
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
</script>

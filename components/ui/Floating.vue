<template>
  <div>
    <div ref="reference">
      <button @click="show = true">
        <slot />
      </button>
    </div>
    <div ref="floating" v-if="show" :style="floatingStyles">
      <slot name="panel" />
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  flip,
  offset,
  useFloating,
  type Placement,
  type Strategy,
} from "@floating-ui/vue";
import { onClickOutside } from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    offsetDistance?: number;
    placement?: Placement;
    strategy?: Strategy;
  }>(),
  {
    strategy: "fixed",
    offsetDistance: 10,
    placement: "right",
  }
);

const reference = ref<HTMLDivElement | null>(null);
const floating = ref<HTMLDivElement | null>(null);
const { floatingStyles } = useFloating(reference, floating, {
  strategy: props.strategy,
  placement: props.placement,
  middleware: [flip(), offset(10)],
});
const show = ref<boolean>(false);
onClickOutside(floating, () => {
  show.value = false;
});
</script>

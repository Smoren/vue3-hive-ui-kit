<template>
  <div class="item">
    <h2 class="widget-title">{{ title }}</h2>
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string;
}>();
</script>

<style lang="scss">
.item {
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(94, 94, 94, 0.432);
  border-radius: 4px;
  background-color: white;

  .widget-title {
    font-weight: bold;
  }
}
</style>

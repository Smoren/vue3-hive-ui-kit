<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="wrapper">
    <div class="title">
      {{ title }}
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">

@use "@/assets/variables" as *;

.wrapper {
  display: flex;
  gap: 10px;
  flex-direction: column;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(53, 55, 80, 0.322);
  .title {
    background: var(--bg-input, $bg-input);
    color: var(--text, $text);
    font-size: 24px;
  }
  .content {
    display: flex;
    gap: 10px;
    flex-direction: column;
    flex-grow: 100;
  }
}
</style>

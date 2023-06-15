<script lang="ts" setup>
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

<style lang="scss" scoped>
.wrapper {
  display: flex;
  gap: 10px;
  flex-direction: column;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(53, 55, 80, 0.322);
  .title {
    font-size: 24px;
  }
  .content {
    display: flex;
    gap: 10px;
    flex-direction: column;
  }
}
</style>

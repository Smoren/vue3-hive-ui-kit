<script setup lang="ts">
import { ref } from 'vue';
import WidgetWrapper from '@/WidgetWrapper.vue';
import HiveButton from './components/hive-button/hive-button.vue';
import HiveTextarea from './components/hive-textarea/hive-textarea.vue';

const text = ref('text');
</script>

<template>
  <div class="wrapper">
    <widget-wrapper title="Button">
      <hive-button disabled />
      <hive-button />
    </widget-wrapper>
    <widget-wrapper title="Textarea">
      {{ text }}
      <hive-textarea v-model="text" resize-direction="both" />
    </widget-wrapper>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 400px;
}
</style>

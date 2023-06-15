<script setup lang="ts">
import { ref } from 'vue';
import HiveButton from './components/hive-button/hive-button.vue';
import HiveTextarea from './components/hive-textarea/hive-textarea.vue';

const text = ref('text');
</script>

<template>
  <hive-button disabled />
  <hive-button />
  <hive-textarea  v-model="text" style="margin-top: 30px;" resize-direction="both"/>
</template>

<style scoped></style>

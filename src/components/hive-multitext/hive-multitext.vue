<script setup lang="ts">
import { computed } from 'vue';
import HiveButton from '@/components/hive-button/hive-button.vue';
import HiveInput from '@/components/hive-input/hive-input.vue';

const props = defineProps<{
  title?: string;
  modelValue: (string | number)[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: (string | number)[]): void;
}>();

const currentValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const addValue = () => {
  currentValue.value.push('');
};
</script>

<template>
  <div class="container">
    <slot name="title">
      <div class="title" v-if="title">{{ title }}</div>
    </slot>
    <div v-for="(_, i) in currentValue" :key="i" class="input">
      <hive-input style="width: 100%" v-model="currentValue[i]!" />
      <hive-button @click="currentValue.splice(i, 1)" class="button">Удалить</hive-button>
    </div>
    <slot name="button" :add-value="addValue">
      <hive-button @click="addValue">Добавить значение</hive-button>
    </slot>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .title {
    font-size: 18px;
  }

  .input {
    display: flex;
    gap: 10px;

    .button {
      width: 30%;
    }
  }
}
</style>
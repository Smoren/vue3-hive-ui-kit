<template>
  <component :is="type" v-model="currentValue" />
  [{{ currentValue }}]
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
// import '@hive/components/assets/scss/semantic.scss';

export default defineComponent({
  name: 'HiveComponent',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: [Number, String, Boolean, Array, Object],
    },
    type: {
      type: Object,
    },
  },
  setup(props, context) {
    // TODO касается всех компонентов HIVE
    // TODO BEGIN: вынести в хук пробрасывания связи
    const currentValue = ref<unknown>(props.modelValue);
    watch(
      () => props.modelValue,
      (newValue) => {
        currentValue.value = newValue;
      }
    );
    // TODO END: вынести в хук пробрасывания связи

    watch(
      () => currentValue.value,
      (newValue) => {
        context.emit('update:modelValue', newValue);
      }
    );

    return {
      currentValue,
    };
  },
});
</script>

<style scoped lang="scss">
@import '@hive/assets/css/semantic.css';
</style>

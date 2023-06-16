<script lang="ts" setup>
import { CommonProps } from '@/common/mixin/props';

interface Props extends CommonProps {
  modelValue: string;
  modelValueEventName?: string;
  placeholder?: string;
  isInvalid?: boolean;
  type: string;
  mask?: string | (() => {});
}

withDefaults(defineProps<Props>(), {
  modelValueEventName: 'input',
  placeholder: 'placeholder',
  isInvalid: false,
});

</script>

<template>
  <div v-bind="attrs" :style="style" class="ui input" :class="{ error: isInvalid }">
    <input :type="type" :class="classes" :placeholder="placeholder" class="hive-input" ref="input" v-mask="mask" />
  </div>
</template>

<style scoped lang="scss">
.hive-input {
  height: fit-content;
  margin: 0;
  max-width: 100%;
  flex: 1 0 auto;
  outline: none;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  text-align: left;
  line-height: 1.21428571rem;
  font-family: 'Lato', 'Helvetica Neue', Arial, Helvetica, sans-serif;
  padding: 0.67857143rem 1rem;
  background: #ffffff;
  border: 1px solid rgba(34, 36, 38, 0.15);
  color: rgba(0, 0, 0, 0.87);
  border-radius: 0.28571429rem;
  transition: box-shadow 0.1s ease, border-color 0.1s ease;
  box-shadow: none;

  &:focus {
    border-color: #85b7d9;
    background: #ffffff;
    color: rgba(0, 0, 0, 0.8);
    -webkit-box-shadow: none;
    box-shadow: none;
  }
}
</style>

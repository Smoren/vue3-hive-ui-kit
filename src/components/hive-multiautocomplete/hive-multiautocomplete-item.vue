<script lang="ts" setup>
import DeleteIcon from '@/components/hive-multiselect/assets/delete-icon.svg';
import { ref } from 'vue';
import { Value } from '@/common/types/value';
import HiveInput from '../hive-input/hive-input.vue';

const props = defineProps<{
  value: Value;
  index: number;
}>();

const emit = defineEmits<{
  (e: 'delete', index: number): void;
  (e: 'edit', value: string, index: number): void;
}>();

const deleteValue = () => {
  emit('delete', props.index);
};

const editRef = ref(false);
const editValue = ref(props.value as string);

const edit = () => {
  if (editValue.value === '') {
    emit('delete', props.index);
  } else {
    emit('edit', editValue.value, props.index);
    editRef.value = false;
  }
};
</script>

<template>
  <div class="hive-multiselect__selected-item" @click="editRef = true">
    <template v-if="!editRef">
      {{ value }}
      <img :src="DeleteIcon" class="hive-multiselect__selected-item__img" @click.stop="deleteValue()" />
    </template>
    <hive-input v-else v-model="editValue" @focusout="edit" />
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.hive-multiselect__selected-item {
  box-sizing: content-box;
  border-radius: var(--border-radius, $border-radius);
  box-shadow: 0 0 0 1px #22242626 inset;
  padding: 3px 9px;
  margin: 3px 0;
  vertical-align: baseline;
  background-color: #e8e8e8;
  color: #0009;
  text-transform: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  text-transform: none;
  font-size: 14px;

  &__img {
    width: 12px;
    height: 12px;
    margin-top: 2px;

    &:hover {
      cursor: pointer;
    }
  }
}
</style>

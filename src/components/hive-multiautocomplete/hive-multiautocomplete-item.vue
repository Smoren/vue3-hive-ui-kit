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

const cancelEdit = () => {
  editValue.value = props.value as string;
  editRef.value = false;
};
</script>

<template>
  <div class="hive-multiselect__selected-item" @click="editRef = true">
    <template v-if="!editRef">
      {{ value }}
      <img :src="DeleteIcon" class="hive-multiselect__selected-item__img" @click.stop="deleteValue()" />
    </template>
    <hive-input
      v-else
      v-model="editValue"
      focus-on-mount
      @focusout="edit"
      @keydown.enter="edit"
      @keydown.esc="cancelEdit"
    />
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';
$item-height: calc($common-widget-height - 10px);

.hive-multiselect__selected-item {
  box-sizing: border-box;
  border-radius: var(--border-radius, $border-radius);
  box-shadow: 0 0 0 1px #22242626 inset;
  padding: 5px 11px;
  vertical-align: baseline;
  background-color: #e8e8e8;
  color: #0009;
  text-transform: none;
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  text-transform: none;
  font-size: 1em;
  font-weight: 500;
  height: 30px;

  &__img {
    width: 1em;
    height: 1em;

    &:hover {
      cursor: pointer;
    }
  }
}
</style>

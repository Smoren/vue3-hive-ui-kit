<script lang="ts" setup>
import { ref } from 'vue';
const emit = defineEmits(['files-dropped']);

let active = ref(false);
let inActiveTimeout: number | undefined = undefined;

function setActive() {
  active.value = true;
  clearTimeout(inActiveTimeout);
}

function setInactive() {
  inActiveTimeout = setTimeout(() => {
    active.value = false;
  }, 50) as unknown as number;
}

function onDrop(e: DragEvent) {
  setInactive();
  emit('files-dropped', e.dataTransfer !== null ? [...e.dataTransfer.files] : e.dataTransfer);
}
</script>

<template>
  <div
    :data-active="active"
    @dragenter.prevent="setActive"
    @dragover.prevent="setActive"
    @dragleave.prevent="setInactive"
    @drop.prevent="onDrop"
  >
    <slot :dropZoneActive="active"></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  file: { type: Object, required: true },
  tag: { type: String, default: 'li' },
});

defineEmits(['remove']);
</script>

<template>
  <component :is="tag" class="file-preview">
    <img src="@/components/hive-upload-file/assets/attach_file.svg" />
    <div>
      {{ file.file.name }}
    </div>
    <button @click="$emit('remove', file)" class="close-icon">&times;</button>
    <span class="status-indicator loading-indicator" v-show="file.status == 'loading'">In Progress</span>
    <span class="status-indicator success-indicator" v-show="file.status == true">Uploaded</span>
    <span class="status-indicator failure-indicator" v-show="file.status == false">Error</span>
  </component>
</template>

<style scoped lang="scss">
.file-preview {
  width: auto;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 5px;
  border: 0 solid transparent;
  border-radius: 0.28571429rem;
  padding: 5px;
  background-color: #e8e8e8;
  .close-icon,
  .status-indicator {
    --size: 20px;
    line-height: var(--size);
    height: var(--size);
    border-radius: var(--size);
    box-shadow: 0 0 5px currentColor;
    appearance: none;
    border: 0;
    padding: 0;
  }

  .close-icon {
    width: var(--size);
    font-size: 30px;
    color: #949494;
    cursor: pointer;
    box-shadow: none;
    background: transparent;
  }

  .status-indicator {
    font-size: calc(0.75 * var(--size));
    bottom: 0.25rem;
    padding: 0 10px;
  }

  .loading-indicator {
    animation: pulse 1.5s linear 0s infinite;
    color: #000;
  }

  .success-indicator {
    background: #6c6;
    color: #040;
  }

  .failure-indicator {
    background: #933;
    color: #fff;
  }
}

@keyframes pulse {
  0% {
    background: #fff;
  }

  50% {
    background: #ddd;
  }

  100% {
    background: #fff;
  }
}
</style>

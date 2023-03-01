<template>
  <div v-if="visible" class="hive-popup">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import commonProps from '@hive/common/mixins/common-props';
// import '@hive/components/assets/scss/semantic.scss';

export default defineComponent({
  name: 'HivePopup',
  props: {
    visible: {
      type: Boolean,
    },
    ...commonProps,
  },
});
</script>

<style lang="scss" scoped>
@import '@hive/assets/css/semantic.css';

.hive-popup {
  position: absolute;
  overflow: auto;
  border: 1px solid #aaa;
  background: white;
}
</style>

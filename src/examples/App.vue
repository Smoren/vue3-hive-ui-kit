<script setup lang="ts">

import HiveSplitter from '@/components/hive-splitter/hive-splitter.vue';
import HivePane from '@/components/hive-splitter/hive-pane.vue';
import AllWidgets from '@/examples/components/all-widgets.vue';

</script>

<template>
  <hive-splitter style="min-height: 100vh;">
    <hive-pane id="light">
      <all-widgets />
    </hive-pane>
    <hive-pane id="dark">
      <div hive-theme="dark" style='background: black; color: white'>
        <all-widgets />
      </div>
    </hive-pane>
  </hive-splitter>
</template>

<style lang="scss">

</style>

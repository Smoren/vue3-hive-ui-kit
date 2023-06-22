<script setup lang="ts">
import { ref } from 'vue';
import WidgetWrapper from '@/WidgetWrapper.vue';
import { HiveButton, HiveLoader, HiveTextarea } from '.';

const text = ref('text');

const handleClick = () => {
  console.log('click');
  text.value = 'onClick';
};

const handleR = () => {
  console.log('clickRRR');
};
</script>

<template>
  <hive-loader />

  <div class="app">
    <div class="wrapper">
      <!-- Button -->
      <widget-wrapper title="Button">
        <hive-button>
          <img src="@/assets/search.svg" alt="image after" class="img" />
          Click
          <img src="@/assets/search.svg" alt="image before" class="img" />
        </hive-button>
        <hive-button disabled />
        <hive-button />
        <hive-button :style="{ backgroundColor: 'red' }" @click.right.prevent="handleR" />
        <hive-button title="Classes" :class="'test'" @click="handleClick" />
      </widget-wrapper>

      <!-- Textarea -->
      <widget-wrapper title="Textarea">
        {{ text }}
        <hive-textarea v-model="text" resize-direction="both" />
      </widget-wrapper>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
}
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 400px;
}

.img {
  width: 15px;
  height: 15px;
}

.test {
  background-color: aqua;
}
</style>

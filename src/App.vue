<script setup lang="ts">
import { ref } from 'vue';
import WidgetWrapper from '@/WidgetWrapper.vue';
import { HiveButton, HiveInput, HiveLoader, HiveTextarea } from '.';

const text = ref('text');
const num = ref(0);

const handleText = () => {
  console.log('click');
  text.value = 'onClick';
};

const handleNum = () => {
  console.log('click');
  num.value = 1000;
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
        <hive-button title="Classes" :class="'test'" @click="handleText" />
      </widget-wrapper>

      <!-- Textarea -->
      <widget-wrapper title="Textarea">
        {{ text }}
        <hive-textarea v-model="text" resize-direction="both" />
      </widget-wrapper>

      <!-- Input -->
      <widget-wrapper title="Input">
        <div>{{ text }}</div>
        <div>{{ num }}</div>
        <hive-button title="Classes" :class="'test'" @click="handleNum" />

        <hive-input v-model="text" />
        <hive-input  v-model="num" type="number" />
        <hive-input  v-model="num" type="number" :step="1" />
        <hive-input  v-model="num" type="text" integer :min="5" :max="6"/>
        <hive-input v-model="num" :mask="/^\d+$/" />
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

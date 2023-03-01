<template>
  <p
    :style="{ width: textWidth }"
    class="hive-marquee"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <span ref="marqueeText" class="hive-marquee__text">
      {{ text }}
    </span>
  </p>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import getTextWidth from '@hive/common/funcs/get-text-width';

export default defineComponent({
  name: 'HiveMarquee',
  props: {
    text: {
      type: String,
      default: '',
    },
    textShownLength: {
      type: Number,
    },
    font: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isHovered: false,
    };
  },
  computed: {
    textWidth() {
      return this.textShownLength === 0
        ? '0'
        : getTextWidth(
            `${this.text.slice(0, this.textShownLength)}...`,
            this.font
          );
    },
  },
  methods: {
    onMouseEnter() {
      (this.$refs.marqueeText as HTMLElement).style.transition = 'left 4s linear';

      (this.$refs.marqueeText as HTMLElement).style.left = `calc(-${getTextWidth(
        this.text,
        this.font
      )} + ${this.textWidth})`;
    },
    onMouseLeave() {
      (this.$refs.marqueeText as HTMLElement).style.transition = '';
      (this.$refs.marqueeText as HTMLElement).style.left = '0';
    },
  },
});
</script>

<style lang="scss" scoped>
.hive-marquee {
  overflow: hidden;

  &:not(:hover) {
    text-overflow: ellipsis;
  }

  &__text {
    position: relative;
    left: 0;
  }
}
</style>

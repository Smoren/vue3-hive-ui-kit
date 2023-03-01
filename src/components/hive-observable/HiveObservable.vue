<template>
  <slot></slot>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import '@hive/components/assets/scss/semantic.scss';

export default defineComponent({
  name: 'HiveObservable',
  emits: ['appear', 'disappear'],
  data(): { observer: null | IntersectionObserver } {
    return {
      observer: null,
    };
  },
  props: {
    root: {
      type: [Object],
      default: null,
    },
    rootMargin: {
      type: [String, Number],
      default: '0px',
    },
    threshold: {
      type: [Array, Number],
      default: 0,
    },
  },
  methods: {
    unobserve() {
      (this.observer as IntersectionObserver).unobserve(this.$el.nextSibling);
    },
  },
  mounted() {
    const options = {
      root: this.root,
      rootMargin: this.rootMargin,
      threshold: this.threshold,
    };
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.$emit('appear', entries[0], this.unobserve);
      } else {
        this.$emit('disappear', entries[0], this.unobserve);
      }
      // eslint-disable-next-line no-undef
    }, options as IntersectionObserverInit) as IntersectionObserver;
    this.observer.observe(this.$el.nextSibling as HTMLElement);
  },
  beforeUnmount() {
    if (this.observer) {
      this.unobserve();
      this.observer = null;
    }
  },
});
</script>

<style lang="scss" scoped>
@import '@hive/assets/css/semantic.css';
</style>

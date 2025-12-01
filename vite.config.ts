import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  plugins: [vue(), cssInjectedByJsPlugin()],
  resolve: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },

  build: {
    cssCodeSplit: true,
    target: 'esnext',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'VueHive',
      formats: ['es'],
      fileName: (format) => `vue-hive.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        preserveModules: true,
        dir: 'dist/es',
        format: 'es',
        entryFileNames: '[name].mjs',
      },
    },
  },
});

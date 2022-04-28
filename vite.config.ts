import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    open: true,
  },
  plugins: [vue()],
  resolve: {
    alias: {
      // '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, 'src'),
    },
  },

  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        //生产环境时移除console
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});

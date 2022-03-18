import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import styleImport, {
  VantResolve,
} from 'vite-plugin-style-import';

export default defineConfig({
  base: '/',
  publicDir: 'public',
  server: {
    host: '0.0.0.0',
    open: true,
    // proxy: {
    //   '/api': {
    //     target: 'http://172.18.3.2:88',
    //     changeOrigin: true,
    //   },
    // },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    reportCompressedSize: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.', 'src'),
    },
  },
  plugins: [
    vue(),
    styleImport({
      resolves: [VantResolve()],
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import "${resolve(
            'src/utils/styles/config.less',
          )}";`,
        },
        javascriptEnabled: true,
      },
    },
  },
});

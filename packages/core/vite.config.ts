import { defineConfig } from 'vite';
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'ZStore',
      formats: ['es', 'umd'],
      fileName: (format) => format === 'es' ? 'index.es.js' : 'index.umd.js'
    }
  }
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import { viteExternalsPlugin } from 'vite-plugin-externals';
// import jsxPlusPlguin from './plugins/jsx-plus.js';
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@zstore/core': '@zstore/core/src/index.ts',
      '@zstore/react': '@zstore/react/src/index.ts',
    },
  },
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-directives'],
      },
    }),
  ],
  optimizeDeps: {
    force: true,
    // entries: ['mobx-react-lite', 'mobx', 'react-beautiful-dnd'],
  },
  // build: {
  //   commonjsOptions: {
  //     include: ['@alife/zlist', /node_modules/],
  //   },
  // },
});

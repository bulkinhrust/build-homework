import path from 'node:path';

export default {
  build: {
    rollupOptions: {
      input: {
        entry: path.resolve(__dirname, 'src/entry.js'),
        performance: path.resolve(__dirname, 'src/performance.js'),
      },
      output: {
        entryFileNames: 'vite/[name].js',
      },
    },
  },
};

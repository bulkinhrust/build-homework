import path from 'node:path';

export default {
  output: {
    path: path.resolve('./dist/webpack'),
  },
  entry: {
    entry: './src/entry.js',
    performance: './src/performance.js'
  }
}
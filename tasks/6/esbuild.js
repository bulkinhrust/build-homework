import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['src/entry.js', 'src/performance.js'],
  outdir: 'dist/esbuild',
}).catch(() => process.exit(1))
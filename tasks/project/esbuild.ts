import esbuild from 'esbuild';
import { htmlPlugin } from '@craftamap/esbuild-plugin-html';

esbuild.build({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  metafile: true,
  sourcemap: 'external',
  publicPath: '/esbuild/',
  outdir: 'dist/esbuild',
  entryNames: "[name]_[hash]",
  chunkNames: "[name]_[hash]",
  assetNames: "assets/[name]_[hash]",
  plugins: [
    htmlPlugin({
      files: [
        {
          entryPoints: [
            'src/index.tsx',
          ],
          filename: 'index.html',
          htmlTemplate: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body>
                <div id="root">
                </div>
            </body>
            </html>
          `,
        },
      ]
    })
  ]
}).catch(() => process.exit(1))

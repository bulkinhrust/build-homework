import css from "rollup-plugin-import-css";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import html from "@rollup/plugin-html";
import swc from "@rollup/plugin-swc";
import replace from "@rollup/plugin-replace";
import path from "node:path";

const aliases = {
  components: "./src/components",
  containers: "./src/containers",
  store: "./src/store",
};

function tsconfigPaths() {
  return {
    name: "tsconfig-paths",
    async resolveId(source, importer) {
      const [alias, ...parts] = source.split("/");

      if (!aliases[alias]) {
        return null;
      }

      return this.resolve(
        path.resolve(import.meta.dirname, aliases[alias], parts.join("/")),
        importer,
        { skipSelf: true },
      );
    },
  };
}

export default {
  input: "./src/index.tsx",
  output: {
    dir: "dist/rollup",
    format: "iife",
    sourcemap: "hidden",
    entryFileNames: "[name]_[hash].js",
    chunkFileNames: "[name]_[hash].js",
    assetFileNames: "[name]_[hash][extname]",
  },
  plugins: [
    tsconfigPaths(),
    nodeResolve({ extensions: [".js", ".ts", ".tsx"] }),
    commonjs(),
    replace({
      preventAssignment: true,
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
    css(),
    swc({
      swc: {
        jsc: {
          parser: {
            syntax: "typescript",
            tsx: true,
          },
          transform: {
            react: {
              runtime: "automatic",
            },
          },
        },
      },
    }),
    html({
      publicPath: "/rollup/",
      title: "TODO App",
      template: ({ bundle, files, publicPath, title }) => {
        const scripts = Object.values(bundle)
          .filter((file) => file.type === "chunk" && file.isEntry)
          .map(({ fileName }) => `<script type="module" src="${publicPath}${fileName}"></script>`)
          .join("");
        const links = files.css
          .map(({ fileName }) => `<link rel="stylesheet" href="${publicPath}${fileName}">`)
          .join("");

        return `
          <!doctype html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>${title}</title>
              ${links}
            </head>
            <body>
              <div id="root"></div>
              ${scripts}
            </body>
          </html>
        `;
      },
    }),
  ],
};

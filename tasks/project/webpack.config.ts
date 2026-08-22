import { Configuration } from "webpack";
import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

const config: Configuration = {
  mode: "production",
  entry: "./src/webpack.tsx",
  devtool: 'hidden-source-map',
  output: {
    path: path.resolve(import.meta.dirname, "dist/webpack"),
    publicPath: "/webpack/",
    filename: '[name]_[contenthash:8].js',
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"],
    alias: {
      components: path.resolve(import.meta.dirname, "./src/components"),
      containers: path.resolve(import.meta.dirname, "./src/containers"),
      store: path.resolve(import.meta.dirname, "./src/store"),
    },
    plugins: [new TsconfigPathsPlugin()],
  },
  experiments: {
    css: true,
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: {
          loader: "swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
                jsx: true,
              },
              transform: {
                react: {
                  runtime: "automatic",
                },
              },
            },
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      templateContent: ({ htmlWebpackPlugin }) => `
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>TODO App</title>
            <script nonce="{{NONCE_VALUE}}">
              window.webpack_nonce = "{{NONCE_VALUE}}";
            </script>
            ${htmlWebpackPlugin.tags.headTags}
          </head>
          <body>
            <div id="root"></div>
            ${htmlWebpackPlugin.tags.bodyTags}
          </body>
        </html>
      `,
    }),
    // new HtmlWebpackPlugin(),
  ],
};

export default config;

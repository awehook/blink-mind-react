const webpack = require("webpack");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;
const styledComponentsTransformer = createStyledComponentsTransformer();

let nodeExternals = require('webpack-node-externals');
let plugins = [new CleanWebpackPlugin()];
const production = process.env.NODE_ENV === "production";

if (production) {
  console.log("creating production build");
  plugins.push(
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": '"production"'
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          drop_console: true,
        },
        ecma: 5,
        mangle: true,
        warnings: false,
      },
      sourceMap: true
    })
  );
}

module.exports =
  //for building the umd distribution
  {
    entry: "./src/main.ts",
    output: {
      filename: "main.js",
      path: __dirname + "/lib",
      libraryTarget: "umd",
      library: "blink-mind-react"
    },
    externals: [nodeExternals()],
    plugins: plugins,
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.js$/,
          loader: "source-map-loader"
        },
        {
          test: /\.tsx?$/,
          loader: "awesome-typescript-loader",
          options: {
            declaration: false,
            getCustomTransformers: () => ({ before: [styledComponentsTransformer] })
          }
        },
        {
          test: /\.css?$/,
          use: [
            "style-loader",
            "css-loader",
          ]
        }
      ]
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"]
    },
    devtool: production ? "source-map" : "cheap-module-eval-source-map",
    mode: production ? "production" : "development",
  };

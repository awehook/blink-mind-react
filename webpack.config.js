const webpack = require("webpack");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
var path = require("path");
var plugins = [new CleanWebpackPlugin()];
const production = process.env.NODE_ENV === "production";

if (production) {
  console.log("creating production build");
  plugins.push(
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": '"production"'
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
    externals: {
      react: {
        root: "React",
        commonjs2: "react",
        commonjs: "react",
        amd: "react"
      },
      "react-dom": {
        root: "ReactDOM",
        commonjs2: "react-dom",
        commonjs: "react-dom",
        amd: "react-dom"
      },
      classnames: {
        root: "classnames",
        commonjs2: "classnames",
        commonjs: "classnames",
        amd: "classnames"
      },
      immutable: {
        root: "immutable",
        commonjs2: "immutable",
        commonjs: "immutable",
        amd: "immutable"
      },
    },
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
          loader: "ts-loader"
        },
        {
          test: /\.scss?$/,
          use: [
            "style-loader",
            "css-loader",
            "sass-loader"
          ]
        }
      ]
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"]
    },
    devtool: production ? "source-map" : "cheap-module-eval-source-map",
    mode: production ? "production" : "development",
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: false,
            ecma: 5,
            mangle: false
          },
          sourceMap: true
        })
      ]
    }
  };

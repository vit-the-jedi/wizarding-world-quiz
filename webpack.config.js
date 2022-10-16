// webpack.config.js
var webpack = require("webpack");
module.exports = {
  entry: {
    entry: __dirname + "/js/main.js",
  },
  output: {
    filename: "main.bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  mode: "development",
  watch: true,
  experiments: {
    topLevelAwait: true,
  },
};

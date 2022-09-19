// webpack.config.js
var webpack = require("webpack");
module.exports = {
  entry: {
    entry: __dirname + "/js/data.js",
  },
  output: {
    filename: "data.bundle.js",
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

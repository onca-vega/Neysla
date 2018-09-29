const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")

module.exports = {
  mode: "production",
  entry: {
    neysla: "./build/neysla.js"
  },
  output: {
    filename: "[name].min.js",
    path: path.resolve(__dirname, "build"),
    publicPath: ""
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({          // Setting production mode
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    new UglifyJsPlugin({
      sourceMap: true
    })
  ]
};

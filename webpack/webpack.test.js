const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = merge(common(true), {
  devtool: "inline-source-map",
  mode: "development",
  plugins: [
    new CopyPlugin({
      patterns: [{ from: ".", to: "../", context: "public" }],
      options: {},
    }),

    // Use additional logging. Debug and Info are silenced for production.
    new webpack.NormalModuleReplacementPlugin(/logger\/index.ts/, "./debug.ts"),
  ],
});

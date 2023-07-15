const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");

module.exports = merge(common, {
  devtool: "inline-source-map",
  mode: "development",
  plugins: [
    new CopyPlugin({
      patterns: [{ from: ".", to: "../", context: "public" }],
      options: {},
    }),

    // https://webpack.js.org/plugins/normal-module-replacement-plugin/#advanced-example
    new webpack.NormalModuleReplacementPlugin(
      /providers\/chrome.ts/,
      "./__mocks__/chrome.ts"
    ),
    new webpack.NormalModuleReplacementPlugin(/logger\/index.ts/, "./debug.ts"),
  ],
});

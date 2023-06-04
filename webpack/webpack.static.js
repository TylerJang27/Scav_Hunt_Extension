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
    new webpack.NormalModuleReplacementPlugin(/providers\/chrome.ts/, "./mock.ts")
    // new webpack.DefinePlugin({
    //   PRODUCTION: JSON.stringify(true),
    //   VERSION: JSON.stringify('5fa3b9'),
    //   BROWSER_SUPPORTS_HTML5: true,
    //   TWO: '1+1',
    //   'typeof window': JSON.stringify('object'),
    //   'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    //   BUILT_AT: webpack.DefinePlugin.runtimeValue(Date.now, {
    //     fileDependencies: [fileDep],
    //   }),
    // });
  ],
});

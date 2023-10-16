const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");

const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = (test) => {
  return {
    entry: {
      popup: path.join(srcDir, "popup.tsx"),
      landing_page: path.join(srcDir, "landing_page.tsx"),
      encode: path.join(srcDir, "encode.tsx"),
      beginning: path.join(srcDir, "beginning.tsx"),
      background: path.join(srcDir, "background.ts"),
      content_script: path.join(srcDir, "content_script.ts"),
    },
    output: {
      path: path.join(__dirname, test ? "../dist_test/js" : "../dist/js"),
      filename: "[name].js",
      clean: true,
    },
    optimization: {
      splitChunks: {
        name: "vendor",
        chunks(chunk) {
          return ![
            "background",
            "popup",
            "beginning",
            "encode",
            "landing_page",
            "content_script",
          ].includes(chunk.name);
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                configFile: test ? "../tsconfig_test.json" : "../tsconfig.json",
              },
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      alias: {
        src: path.resolve(srcDir),
      },
      extensions: [".ts", ".tsx", ".js"],
      fallback: { path: require.resolve("path-browserify") },
    },
    plugins: [
      new CopyPlugin({
        patterns: [{ from: ".", to: "../", context: "public" }],
        options: {},
      }),
      // new BundleAnalyzerPlugin(),
    ],
  };
};

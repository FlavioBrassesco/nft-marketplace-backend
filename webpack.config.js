const path = require("path");
const nodeExternals = require("webpack-node-externals");
module.exports = [
  {
    name: "server",
    entry: "./server/server.ts",
    target: "node",
    output: {
      path: path.join(__dirname, "dist"),
      filename: "server.generated.js",
    },
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.(js|jsx|tsx|ts)$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    node: {
      __dirname: false,
    },
  },
];

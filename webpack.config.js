const nodeExternals = require("webpack-node-externals");
const config = {
  name: "server",
  entry: [path.join(__dirname, "./server/server.js")],
  target: "node",
  output: {
    path: path.join(__dirname, "/dist/"),
    filename: "server.generated.js",
    publicPath: "/dist/",
    libraryTarget: "commonjs2",
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
};
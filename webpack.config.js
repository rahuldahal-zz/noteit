const currentTask = process.env.npm_lifecycle_event;

const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");

let cssConfig = {
  test: /\.(sa|sc|c)ss$/i,
  use: ["css-loader?url=false", "sass-loader"],
};

let babelConfig = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: "babel-loader",
};

let config = {
  entry: "./frontend/App.js",
  module: {
    rules: [babelConfig, cssConfig],
  },
  plugins: [],
};

//separate for "development"
if (currentTask === "dev" || currentTask === "frontend") {
  cssConfig.use.unshift("style-loader");
  config.mode = "development";
  config.devtool = "inline-source-map";
  config.devServer = {
    port: 5000,
    contentBase: path.resolve(__dirname, "/frontend/public"),
    writeToDisk: true,
  };
  config.plugins.push(
    new HtmlWebPackPlugin({
      filename: "index.html",
      template: "./frontend/index.ejs",
    })
  );
  config.output = {
    filename: "main-bundled.js",
    path: path.resolve(__dirname, "./frontend/public"),
  };
}

//separate for "production"
if (currentTask === "build") {
  cssConfig.use.unshift(MiniCssExtractPlugin.loader);
  config.mode = "production";
  config.output = {
    filename: "[name].js",
    chunkFilename: "[name].js",
    path: path.resolve(__dirname, "./frontend/public"),
    publicPath: "/public",
  };
  config.optimization = {
    splitChunks: { chunks: "all" },
  }; //separates vendors and custom scripts (vendor = editor.js)
  config.plugins.push(
    new HtmlWebPackPlugin({
      filename: "index.html",
      template: "./frontend/index.ejs",
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "styles.css",
    })
  );
}

module.exports = config;

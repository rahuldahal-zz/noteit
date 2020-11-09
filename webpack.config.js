const currentTask = process.env.npm_lifecycle_event;

const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");

let cssConfig = {
  test: /\.(sa|sc|c)ss$/i,
  use: ["css-loader?url=false", "sass-loader"],
};

let config = {
  entry: "./frontend-js/main.js",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      cssConfig,
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      filename: path.resolve(__dirname, "views/includes/head.ejs"),
      template: './views/includes/head.template.ejs',
      chunks: []
    }),
  ],
  node: {
    __dirname: false,
  },
};

//separate for "development"
if (currentTask === "dev") {
  cssConfig.use.unshift("style-loader");
  config.mode = "development";
  config.devtool = "inline-source-map";
  config.output = {
    filename: "main-bundled.js",
    path: path.resolve(__dirname, "public/js"),
  };
  config.plugins.push(new HtmlWebPackPlugin({
    filename: path.resolve(__dirname, "views/includes/footer.ejs"),
    template: './views/includes/footer.template.ejs',
    chunks: [],
    devServer: true
  }),)
}

//separate for "production"
if (currentTask === "build") {
  cssConfig.use.unshift(MiniCssExtractPlugin.loader);
  config.mode = "production";
  config.output = {
    filename: "[name]-[chunkhash].js",
    chunkFilename: "[name]-[chunkhash].js",
    path: path.resolve(__dirname, "public/js"),
  };
  config.optimization = {
    splitChunks: { chunks: "all" },
  }; //separates vendors and custom scripts (vendor = editor.js)
  config.plugins.push(
    new HtmlWebPackPlugin({
      filename: path.resolve(__dirname, "views/includes/footer.ejs"),
      template: './views/includes/footer.template.ejs',
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
    filename: "styles-[chunkhash].css",
  }))
}

module.exports = config;

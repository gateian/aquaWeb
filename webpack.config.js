const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  watch: true,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.tpl$/i,
        type: "asset/source",
        include: path.resolve(__dirname, 'templates')
      },
      {
        test: /\.s[ac]ss$/i,
          use: [

            // Creates `style` nodes from JS strings
            //{ loader: "style-loader", options: { injectType: "linkTag" } },
            // Translates CSS into CommonJS
            MiniCssExtractPlugin.loader,

            "css-loader",
            // Compiles Sass to CSS
            "sass-loader",
          ],
        },
        {
          test: /\.glsl$/i,
          use: "webpack-glsl-loader",
          exclude: /node_modules/
        }
    ],
  },
  plugins: [new MiniCssExtractPlugin(), new HtmlWebpackPlugin() ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'aquaWeb.js',
    library: {
      name: "aquaWeb",
      type: 'umd',
    },
    path: path.resolve(__dirname, 'dist'),
  },
};
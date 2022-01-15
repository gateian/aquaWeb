/*
const path = require('path');
// const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
var InlineChunkHtmlPlugin = require('inline-chunk-html-plugin');

var PACKAGE_NAME = 'aquaWeb';
var ENTRY_POINT = './src/index.ts';

 const clientConfig = {
  entry: ENTRY_POINT,
  watch: true,
  mode: 'development',
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
        include: path.resolve(__dirname, 'templates')
      },
      {
        test: /\.s[ac]ss$/i,
        use: [

          // Translates CSS into CommonJS
          MiniCssExtractPlugin.loader,

          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test:/\.(svg|jpg|png|gif)$/,
        use: [{
            loader:'file-loader',
            options: {
                publicPath: path.resolve(__dirname, '/src/css/img/'),
                outputPath: 'img',
                name: '[name].[ext]',
                esModule: false
            }
        }],
    },
    ],
  },
  
  resolve: {
    extensions: [ '.js', '.ts', '.html' ],
    alias: {
      'firstPersonControls': 'three/examples/jsm/controls/FirstPersonControls.js'
    }
  },
  output: {
    filename: PACKAGE_NAME + '.js',
    path: path.resolve(__dirname, 'dist'),
    //publicPath: 'dist/',
    library: {
      name: PACKAGE_NAME,
      type: 'umd',
    },
  },
};


module.exports = [ clientConfig ];
*/

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
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
  watchOptions: {
    // ignored: /node_modules/
  },
  plugins: [
    new HtmlWebpackPlugin({ 
      title: 'Aqua Web', 
      inject: false,
      templateContent: `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Aqua Web</title> 
          
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script>
          window.onload = () => { aquaWeb.Init(); }
          </script>
        </head>
        <body style="background-color: rgba(255, 0, 0, 0)">
          <div id="container"></div>
        </body>
      </html>` }),
    new MiniCssExtractPlugin(),
    //new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/\.(js|css|html)$/]),
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
          "style-loader",
          // MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              url: false
            }
          },
           {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
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
  optimization: {
    minimize: false
  },
  output: {
    filename: PACKAGE_NAME + '.js',
    //path: path.resolve(__dirname, 'dist'),
    //publicPath: 'dist/',
    library: {
      name: PACKAGE_NAME,
      type: 'umd',
    },
  },
};


module.exports = [ clientConfig ];
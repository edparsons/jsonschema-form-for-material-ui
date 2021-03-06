/* eslint-disable */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const babelExclude = /node_modules/;
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const extractScss = new ExtractTextPlugin({ filename: "style.css", allChunks: true })
const extractCss = new ExtractTextPlugin({ filename: "main.css", allChunks: true })

const alias = {}

var config = {
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    path.join(__dirname, 'demo/index.jsx')
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'demo.js',
    publicPath: '/',
  },
  mode: process.env.NODE_ENV,
  devtool: 'source-map',
  module: {
    rules: [{
      oneOf: [{
          test: /\.jsx?$/,
          use: ['babel-loader'],
          exclude: babelExclude,
        },
        {
          test: /\.scss$/,
          use: extractScss.extract({
            use: [{
              loader: 'css-loader',
              options: {
                localIdentName: '[path]__[name]__[local]__[hash:base64:5]',
                modules: true,
                camelCase: true,
              }
            }, {
              loader: 'sass-loader',
            }]
          }),
        },
        {
          test: /\.css$/,
          use: extractCss.extract({
            use: [{
              loader: 'css-loader',
            }]
          }),
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          loaders: [{
            loader: 'url-loader',
            options: {
              limit: 50000,
            },
          }, {
            loader: 'image-webpack-loader',
          }]
        },
        {
          exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/, /.s?css$/],
          loader: 'file-loader',
          options: {
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
      ]
    }]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias,
    modules: ['node_modules']
  },
  plugins: [
    extractCss,
    extractScss,
    new HtmlWebpackPlugin({
      template: 'demo/index.html',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  target: 'web',
  devServer: {
    contentBase: path.join(__dirname, 'demo'),
    compress: true,
    port: 8080
  }
}
module.exports = config

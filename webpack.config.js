'use strict';

const path = require('path');
require('dotenv').config();

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const port = process.env.PORT;

let baseConfig = {
  entry: [
    'bootstrap-loader',
    path.join(__dirname, 'client/style/main.scss'),
    path.join(__dirname, 'client/main.js')
  ],
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },
  resolve: {
    alias: {
      style: path.join(__dirname, './client/style'),
      components: path.join(__dirname, './client/components')
    }
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: 'babel-loader',
      exclude: path.join(__dirname, 'node_modules')
    }, {
      test: /\.vue$/,
      loader: 'vue-loader'
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        use: ['css-loader'],
        fallback: 'style-loader'
      })
    }, {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        use: ['css-loader', 'sass-loader'],
        fallback: 'style-loader'
      })
    }, {
      test: /bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/,
      use: 'imports-loader?jQuery=jquery'
    }, {
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'url-loader',
      query: {
        limit: 10000,
        name: '[name].[ext]?[hash]'
      }
    }, {
      test: /\.(woff2?|svg)$/,
      loader: 'url-loader',
      query: {
        limit: 10000
      }
    }, {
      test: /\.(ttf|eot)$/,
      use: 'file-loader'
    }]
  },
  plugins: [
    new CopyWebpackPlugin([{ from: 'assets', to: 'dist/assets' }]),
    new ExtractTextPlugin('style.css'),
    new HtmlWebpackPlugin({
      filename: path.join(__dirname, 'dist/index.html'),
      template: path.join(__dirname, 'client/index.html'),
      inject: true
    })
  ],
};

module.exports = env => {
  let config = Object.assign({}, baseConfig);
  if (env === 'dev') {
    config.devtool = 'eval';
    config.devServer = {
      disableHostCheck: true,
      contentBase: path.join(__dirname, 'dist'),
      port: 9090,
      proxy: {
        '/api': `http://localhost:${port}`
      }
    };
  }
  return config;
};

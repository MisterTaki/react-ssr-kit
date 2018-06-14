const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const baseWebpackConfig = require('./webpack.common.js');

const { devEnv } = require('../config');

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true, // https://webpack.js.org/loaders/css-loader/#modules
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
              importLoaders: 2, // https://webpack.js.org/loaders/css-loader/#importloaders
            }
          },
          'postcss-loader',
          // https://github.com/ant-design/ant-design/issues/7927#issuecomment-372513256
          { loader: 'less-loader', options: { javascriptEnabled: true } }
        ]
      }
    ]
  },
  // https://webpack.js.org/configuration/optimization
  optimization: {
    namedModules: true,
    noEmitOnErrors: true
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.DefinePlugin({
      'process.env': devEnv,
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../public/index.html'),
      BASE_URL: './'
    }),
    // https://github.com/GoogleChromeLabs/preload-webpack-plugin
    new PreloadWebpackPlugin({
      rel: 'preload',
      include: 'initial',
      fileBlacklist: [/\.map$/, /hot-update\.js$/]
    }),
    new PreloadWebpackPlugin({
      rel: 'prefetch',
      include: 'asyncChunks'
    }),
    // https://webpack.js.org/plugins/hot-module-replacement-plugin
    new webpack.HotModuleReplacementPlugin()
  ]
});

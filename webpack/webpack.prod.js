const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const baseWebpackConfig = require('./webpack.common.js');

const { prodEnv, uglifyOptions } = require('../config');

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].js',
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true, // https://webpack.js.org/loaders/css-loader/#modules
              localIdentName: '[local]--[hash:base64:5]',
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
    minimize: true,
    minimizer: [
      new UglifyJsPlugin(uglifyOptions)
    ],
    // https://webpack.js.org/plugins/split-chunks-plugin
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': prodEnv,
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../public/index.html'),
      BASE_URL: './',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency',
    }),
    // https://github.com/GoogleChromeLabs/preload-webpack-plugin
    new PreloadWebpackPlugin({
      rel: 'preload',
      include: 'initial',
      fileBlacklist: [/\.map$/]
    }),
    new PreloadWebpackPlugin({
      rel: 'prefetch',
      include: 'asyncChunks'
    }),
    // https://webpack.js.org/plugins/mini-css-extract-plugin
    new MiniCssExtractPlugin({
      filename: `css/[name].[contenthash:8].css`,
      chunkFilename: 'css/[name].[id].[contenthash:8].css'
    }),
    // https://github.com/NMFR/optimize-css-assets-webpack-plugin
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {
        safe: true,
        autoprefixer: { disable: true },
        mergeLonghand: false
      },
      canPrint: false
    }),
    // https://webpack.js.org/plugins/hashed-module-ids-plugin
    new webpack.HashedModuleIdsPlugin()
  ],
});

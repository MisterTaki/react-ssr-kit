const path = require('path');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const SRC_DIR = path.resolve(__dirname, '../src');
const DIST_DIR = path.resolve(__dirname, '../dist');

module.exports = {
  context: SRC_DIR,

  target: 'web',

  entry: [
    path.resolve(__dirname, '../config/polyfills.js'),
    path.resolve(__dirname, '../src/index.js')
  ],

  output: {
    path: DIST_DIR,
    filename: '[name].js',
    publicPath: './',
  },

  resolve: {
    modules: [
      SRC_DIR,
      'node_modules',
    ],

    extensions: ['.js', '.jsx', '.json'],

    alias: {
      '@': SRC_DIR
    }
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        include: [SRC_DIR],
        use: [
          {
            loader: 'eslint-loader',
            options: {
              cache: true,
              formatter: require('eslint-friendly-formatter')
            },
          }
        ]
      },
      {
        test: /\.(js|jsx)$/,
        include: [SRC_DIR],
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: path.resolve(__dirname, '../node_modules/.cache/cache-loader')
            }
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:8].[ext]'
        },
      },
      {
        test: /\.(svg)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'img/[name].[hash:8].[ext]'
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:8].[ext]'
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:8].[ext]'
        },
      }
    ]
  },

  plugins: [
    // https://github.com/geowarin/friendly-errors-webpack-plugin
    new FriendlyErrorsPlugin(),
    // https://github.com/Urthen/case-sensitive-paths-webpack-plugin
    new CaseSensitivePathsPlugin(),
    // https://webpack.js.org/plugins/copy-webpack-plugin
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../public'),
        to: DIST_DIR,
        ignore: ['index.html', '.DS_Store']
      }
    ])
  ]
};

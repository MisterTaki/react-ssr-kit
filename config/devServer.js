const path = require('path');

exports.devServer = {
  host: '0.0.0.0',
  port: 8080,
  https: false,
  clientLogLevel: 'none',
  historyApiFallback: {
    disableDotRule: true
  },
  contentBase: path.join(__dirname, '../public'),
  watchContentBase: true,
  publicPath: '/',
  compress: false,
  hot: true,
  quiet: true,
  open: true,
  // proxy: {
  //   '/api': {
  //     target: 'http://127.0.0.1:3000',
  //     changeOrigin: true,
  //   },
  // }
};

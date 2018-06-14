// https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-service/lib/commands/build/index.js

const path = require('path');
const fs = require('fs-extra')
const zlib = require('zlib');
const ui = require('cliui')({ width: 80 });
const chalk = require('chalk');
const webpack = require('webpack');
const merge = require('webpack-merge');

const {
  log,
  done,
  info,
  logWithSpinner,
  stopSpinner
} = require('./utils');
const { testEnv } = require('../config');
const webpackConfig = require('../webpack/webpack.prod.js');

const argv = require('minimist')(process.argv.slice(2));

let _webpackConfig = webpackConfig;

if (argv.test) {
  let DefinePluginIndex;
  webpackConfig.plugins.some((item, index) => {
    if (item.constructor.name === 'DefinePlugin') {
      DefinePluginIndex = index;
      return true;
    }
    return false;
  })
  webpackConfig.plugins.splice(DefinePluginIndex, 1);
  _webpackConfig = merge(webpackConfig, {
    output: {
      path: path.resolve(__dirname, '../dist_qa')
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': testEnv
      })
    ]
  });
}

function formatStats (stats, dir) {
  const json = stats.toJson({
    hash: false,
    modules: false,
    chunks: false
  });

  let assets = json.assets
    ? json.assets
    : json.children.reduce((acc, child) => acc.concat(child.assets), []);

  const seenNames = new Map();
  const isJS = val => /\.js$/.test(val);
  const isCSS = val => /\.css$/.test(val);
  const isMinJS = val => /\.min\.js$/.test(val);
  assets = assets
    .filter(a => {
      if (seenNames.has(a.name)) {
        return false
      }
      seenNames.set(a.name, true)
      return isJS(a.name) || isCSS(a.name)
    })
    .sort((a, b) => {
      if (isJS(a.name) && isCSS(b.name)) return -1
      if (isCSS(a.name) && isJS(b.name)) return 1
      if (isMinJS(a.name) && !isMinJS(b.name)) return -1
      if (!isMinJS(a.name) && isMinJS(b.name)) return 1
      return b.size - a.size
    });

  function formatSize (size) {
    return (size / 1024).toFixed(2) + ' kb'
  }

  function getGzippedSize (asset) {
    const filepath = path.resolve(_webpackConfig.output.path, asset.name)
    const buffer = fs.readFileSync(filepath)
    return formatSize(zlib.gzipSync(buffer).length)
  }

  function makeRow (a, b, c) {
    return `  ${a}\t    ${b}\t ${c}`
  }

  ui.div(
    makeRow(
      chalk.cyan.bold(`File`),
      chalk.cyan.bold(`Size`),
      chalk.cyan.bold(`Gzipped`)
    ) + `\n\n` +
    assets.map(asset => makeRow(
      /js$/.test(asset.name)
        ? chalk.green(path.join(dir, asset.name))
        : chalk.blue(path.join(dir, asset.name)),
      formatSize(asset.size),
      getGzippedSize(asset)
    )).join(`\n`)
  );

  return `${ui.toString()}\n\n  ${chalk.gray(`Images and other types of assets omitted.`)}\n`;
}

async function build () {
  log();

  logWithSpinner(`Building for production...`);

  const targetDir = _webpackConfig.output.path;

  await fs.remove(targetDir);

  return new Promise((resolve, reject) => {
    webpack(_webpackConfig, (err, stats) => {
      stopSpinner(false);
      if (err) {
        return reject(err);
      }

      if (stats.hasErrors()) {
        return reject(`Build failed with errors.`);
      }

      const targetDirShort = path.relative(
        path.resolve(__dirname, '../'),
        targetDir
      );

      log(formatStats(stats, targetDirShort));

      done(`Build complete. The ${chalk.cyan(targetDirShort)} directory is ready to be deployed.\n`);

      resolve()
    })
  })
}

module.exports = build();

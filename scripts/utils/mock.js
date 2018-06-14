// https://github.com/jaywcjlove/webpack-api-mocker/blob/master/index.js
// https://github.com/sorrycc/roadhog/blob/master/src/utils/mock.js

const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');
const { clearConsole, log, info, warn, done } = require('./logger');

const METHOD = ['get', 'post', 'put', 'delete', 'proxy'];
const VALUE_TYPE = ['function', 'object', 'string'];

function parseKey(key) {
  let method = 'get';
  let path = key;

  if (key.indexOf(' ') > -1) {
    const splited = key.split(' ');
    method = splited[0].toLowerCase();
    path = splited[1];
  }

  return { method, path };
}

function checkMocks(mockConfig, mockKeys, devServer) {
  return mockKeys.some(key => {
    const { method, path } = parseKey(key);

    if (METHOD.indexOf(method) < 0) {
      warn(`Method of ${key} is not valid`);
      return true;
    }

    const value = mockConfig[key];

    const valueType = typeof value;

    if (VALUE_TYPE.indexOf(valueType) < 0) {
      warn(`Mock value of ${key} should be function or object or string, but got ${valueType}`);
      return true;
    }

    if (method === 'proxy') {
      const proxyValue = valueType === 'string' ? {
        target: value,
        changeOrigin: true,
      } : valueType === 'object' ? value : value();

      devServer.proxy = {
        ...devServer.proxy,
        [path]: proxyValue,
      };

      return false;
    }

    if (valueType === 'string') {
      warn(`Mock value of ${key} should be function or object, but got string`);
      return true;
    }

    return false;
  })
}

function cleanCache(modulePath) {
  const module = require.cache[modulePath];
  // remove reference in module.parent
  if (module.parent) {
    module.parent.children.splice(module.parent.children.indexOf(module), 1);
  }
  require.cache[modulePath] = null;
}

exports.mock = function (devServer, customBefore, mockFile, mockDir) {
  if (!fs.existsSync(mockFile)) {
    if (customBefore) {
      return customBefore;
    }
    return undefined;
  }

  let mockConfig = require(mockFile);

  let mockKeys = Object.keys(mockConfig);

  const hasError = checkMocks(mockConfig, mockKeys, devServer);

  if (hasError) {
    warn('Please modify mock files and retry...');
    log();
    mockConfig = {};
    mockKeys = [];
  } else {
    info('Start mock server successfully!');
    log();
  }

  return function(app) {
    const _mockDir = mockDir ? mockDir : path.resolve(mockFile, '..');
    const watcher = chokidar.watch([mockFile, _mockDir]);

    watcher.on('change', () => {
      info('Mock files changed...');
      cleanCache(mockFile);

      const newMockConfig = require(mockFile);
      const newMockKeys = Object.keys(newMockConfig);
      const hasError = checkMocks(newMockConfig, newMockKeys, devServer);

      if (hasError) {
        warn('Please modify mock files and retry...');
        log();
        return false;
      }

      clearConsole();
      done('Update mock server successfully!');
      log();
      mockConfig = newMockConfig;
      mockKeys = newMockKeys;
      return true;
    });

    app.all('/*', function (req, res, next) {
      const mockKey = `${req.method} ${req.path}`;
      const mockValue = mockConfig[mockKey];
      if (mockValue) {
        if (typeof mockValue === 'function') {
          return mockValue(req, res, next);
        }
        return res.json(mockValue);
      }
      return next();
    })
  }
};

// https://github.com/facebook/create-react-app/blob/next/packages/react-scripts/config/polyfills.js

if (typeof Promise === 'undefined') {
  require('promise/lib/rejection-tracking').enable();
  window.Promise = require('promise/lib/es6-extensions.js');
}

Object.assign = require('object-assign');

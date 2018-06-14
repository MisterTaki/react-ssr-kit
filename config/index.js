[
  'env',
  'devServer',
  'uglifyOptions',
  'polyfills'
].forEach(m => {
  Object.assign(exports, require(`./${m}`));
});

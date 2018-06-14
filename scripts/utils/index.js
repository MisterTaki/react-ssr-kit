[
  'logger',
  'spinner',
  'mock',
  'env'
].forEach(m => {
  Object.assign(exports, require(`./${m}`));
});

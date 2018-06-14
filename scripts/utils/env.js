// https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-shared-utils/lib/env.js

const { execSync } = require('child_process');

let _hasYarn;
let _hasGit;

// env detection
exports.hasYarn = () => {
  if (_hasYarn != null) {
    return _hasYarn;
  }
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return (_hasYarn = true);
  } catch (e) {
    return (_hasYarn = false);
  }
}

exports.hasGit = () => {
  if (_hasGit != null) {
    return _hasGit;
  }
  try {
    execSync('git --version', { stdio: 'ignore' });
    return (_hasGit = true);
  } catch (e) {
    return (_hasGit = false);
  }
}

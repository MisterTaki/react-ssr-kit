// https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-plugin-eslint/lint.js

const path = require('path');
const chalk = require('chalk');
const { CLIEngine } = require('eslint');

const { log, done } = require('./utils');

const files = ['src/'];

const config = {
  fix: true,
  silent: false,
  cwd: path.resolve(__dirname, '..'),
  useEslintrc: true,
  extensions: ['.js', '.jsx']
};

function lint () {
  const engine = new CLIEngine(config);
  const report = engine.executeOnFiles(files);
  const formatter = engine.getFormatter('codeframe');

  if (config.fix) {
    CLIEngine.outputFixes(report);
  }

  if (!report.errorCount) {
    if (!config.silent) {
      const hasFixed = report.results.some(f => f.output);
      if (hasFixed) {
        log(`The following files have been auto-fixed:`);
        log();
        report.results.forEach(f => {
          if (f.output) {
            log(`  ${chalk.blue(path.relative(cwd, f.filePath))}`);
          }
        })
        log();
      }
      if (report.warningCount) {
        console.log(formatter(report.results));
      } else {
        done(hasFixed ? `All lint errors auto-fixed.` : `No lint errors found!`)
      }
    }
  } else {
    console.log(formatter(report.results));
    process.exit(1);
  }
}

module.exports = lint();

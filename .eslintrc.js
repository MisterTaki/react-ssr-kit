module.exports = {
  root: true,
  extends: 'airbnb',
  parser: 'babel-eslint',
  env: {
    browser: true,
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack/webpack.common.js',
      },
    },
  },
  rules: {
    // custom rules here
    'no-console': 'off',
    'max-len': ['error', 80, 2, {
      ignoreUrls: true,
      ignoreComments: true,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
    'jsx-a11y/anchor-is-valid': 'off',
    'react/prop-types': ['warn', { ignore: ['className'] }],
  },
};

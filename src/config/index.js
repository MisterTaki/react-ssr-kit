const { NODE_ENV } = process.env;

const baseURLs = {
  development: '',
  test: '',
  production: '',
};

export const baseURL = baseURLs[NODE_ENV]; // eslint-disable-line import/prefer-default-export

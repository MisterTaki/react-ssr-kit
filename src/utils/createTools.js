import { DEFAULT, REQUEST, SUCCESS, FAILURE } from '@/const/requestTypes';

export const createType = (namespace, type) => `${namespace}/${type}`;

export const createRequestTypes = (namespace, type) =>
  [DEFAULT, REQUEST, SUCCESS, FAILURE].reduce((result, suffix) => ({
    ...result,
    [suffix]: suffix === DEFAULT ? `${namespace}/${type}` : `${namespace}/${type}_${suffix}`,
  }), {});

export const createAction = (type, payload = {}) => ({
  type,
  ...payload,
});

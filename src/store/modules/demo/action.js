import { createRequestTypes, createAction } from '@/utils/createTools';
import { DEFAULT, REQUEST, SUCCESS, FAILURE } from '@/const/requestTypes';

const NAME_SPACE = 'demo';

export const LOAD_USER_TYPES = createRequestTypes(NAME_SPACE, 'LOAD_USER');

export const LOAD_USER = LOAD_USER_TYPES[DEFAULT];

export const loadUser = id => createAction(LOAD_USER_TYPES[DEFAULT], { id });

export const loadUserTypes = {
  request: () => ({
    type: LOAD_USER_TYPES[REQUEST],
  }),
  success: ({ id }) => ({
    type: LOAD_USER_TYPES[SUCCESS],
    id,
  }),
  failure: error => ({
    type: LOAD_USER_TYPES[FAILURE],
    error,
  }),
};

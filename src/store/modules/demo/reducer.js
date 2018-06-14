import { switchCase } from '@/utils';
import { REQUEST, SUCCESS, FAILURE } from '@/const/requestTypes';

import { LOAD_USER_TYPES } from './action';

const initialState = {
  user: {},
};

export default (state = initialState, action = {}) => (
  switchCase({
    [LOAD_USER_TYPES[REQUEST]]: {
      ...state,
      loading: true,
      loaded: false,
    },
    [LOAD_USER_TYPES[SUCCESS]]: {
      ...state,
      loading: false,
      loaded: true,
      user: action.data,
    },
    [LOAD_USER_TYPES[FAILURE]]: {
      ...state,
      loading: false,
      loaded: false,
      error: action.error,
    },
  })(state)(action.type)
);

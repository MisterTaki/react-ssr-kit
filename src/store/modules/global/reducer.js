import { switchCase } from '@/utils';
import { START, SUCCESS, FAILURE } from './action';

const initialState = {
  loading: 'initialize',
};

export default (state = initialState, action = {}) => (
  switchCase({
    [START]: {
      ...state,
      loading: 'start',
    },
    [SUCCESS]: {
      ...state,
      loading: 'success',
    },
    [FAILURE]: {
      ...state,
      loading: 'failure',
    },
  })(state)(action.type)
);

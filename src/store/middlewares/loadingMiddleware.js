import { startLoading, successLoading, failureLoading } from '@/store/modules/global/action';
import { REQUEST, SUCCESS, FAILURE } from '@/const/requestTypes';

const defaultTypeSuffixes = [REQUEST, SUCCESS, FAILURE];

export default function (config = {}) {
  const promiseTypeSuffixes = config.typeSuffixes || defaultTypeSuffixes;

  return ({ dispatch }) => next => (action) => {
    if (action.type) {
      const [request, success, failure] = promiseTypeSuffixes;

      const isStart = new RegExp(`_${request}$`, 'g');
      const isSuccess = new RegExp(`_${success}$`, 'g');
      const isError = new RegExp(`_${failure}$`, 'g');

      if (action.type.match(isStart)) {
        dispatch(startLoading());
      } else if (action.type.match(isSuccess)) {
        dispatch(successLoading());
      } else if (action.type.match(isError)) {
        dispatch(failureLoading());
      }
    }

    return next(action);
  };
}

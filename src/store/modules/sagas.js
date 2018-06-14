import { fork, take, cancel, all } from 'redux-saga/effects';

import { REPLACE_SAGAS } from '@/const/requestTypes';
import demo from './demo/saga';

function* startSaga(sagas) {
  yield all(sagas);
}

// https://github.com/redux-saga/redux-saga/issues/160
export const rootSagas = [...demo];

// https://gist.github.com/mpolci/f44635dc761955730f8479b271151cf2
export default process.env.NODE_ENV === 'development' ?
  function* dynamicSaga() {
    let rootTask = yield fork(startSaga, rootSagas);
    while (true) {
      const { nextSagas } = yield take(REPLACE_SAGAS);
      yield cancel(rootTask);
      rootTask = yield fork(startSaga, nextSagas);
    }
  } : function* defaultSaga() {
    yield all(rootSagas);
  };

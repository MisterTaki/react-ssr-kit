import { call, put, takeLatest } from 'redux-saga/effects';

import test from '@/api/demo';
import * as actions from './action';

const { loadUserTypes, LOAD_USER } = actions;

function* loadUser({ params }) {
  yield put(loadUserTypes.request());
  const { data, error } = yield call(test, params);
  if (data) {
    yield put(loadUserTypes.success(data));
  } else {
    yield put(loadUserTypes.failure(error));
  }
}

export default [
  takeLatest(LOAD_USER, loadUser),
];

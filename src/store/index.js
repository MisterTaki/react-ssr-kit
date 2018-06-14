import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import { REPLACE_SAGAS } from '@/const/requestTypes';
import { loadingMiddleware } from './middlewares';
import * as reducers from './modules/reducers';
import sagas from './modules/sagas';

// https://github.com/zalmoxisus/redux-devtools-extension
let composeEnhancers = compose;

// eslint-disable-next-line no-underscore-dangle
const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

if (process.env.NODE_ENV === 'development' && reduxDevTools) {
  composeEnhancers = reduxDevTools;
}

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux
const history = createHistory();

// https://github.com/redux-saga/redux-saga
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer,
  }),
  composeEnhancers(applyMiddleware(
    loadingMiddleware(),
    routerMiddleware(history),
    sagaMiddleware,
  )),
);

sagaMiddleware.run(sagas);

/* eslint-disable global-require */
if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  // https://github.com/reduxjs/react-redux/releases/tag/v2.0.0
  module.hot.accept('./modules/reducers.js', () => {
    const nextRootReducer = require('./modules/reducers.js');
    store.replaceReducer(combineReducers({
      ...nextRootReducer,
      router: routerReducer,
    }));
  });
  // Enable Webpack hot module replacement for sagas
  // https://stackoverflow.com/questions/37148592/redux-saga-hot-reloading
  module.hot.accept('./modules/sagas.js', () => {
    const { rootSagas: nextSagas } = require('./modules/sagas.js');
    store.dispatch({ type: REPLACE_SAGAS, nextSagas });
  });
}

export { history, store };

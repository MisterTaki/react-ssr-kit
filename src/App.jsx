import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { hot } from 'react-hot-loader'; // eslint-disable-line import/no-extraneous-dependencies

import { store, history } from './store';
import router from './router';
import './style/index.less';

const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        {router.map(item => (
          <Route
            key={item.label}
            path={item.path}
            component={item.component}
            exact={item.isExact}
          />
        ))}
      </Switch>
    </ConnectedRouter>
  </Provider>
);

export default hot(module)(App);

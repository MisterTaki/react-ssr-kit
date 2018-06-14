import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import logo from '@/assets/logo.svg';
import styles from './Home.less';

// https://github.com/JedWatson/classnames#alternate-bind-version-for-css-modules
const cls = classNames.bind(styles);

const Home = ({ className, demo }) => (
  <div className={cls('App', className)}>
    <header className={cls('App-header')}>
      <img src={logo} className={cls('App-logo')} alt="logo" />
      <h1 className={cls('App-title')}>Welcome to React</h1>
    </header>
    <p className={cls('App-intro')}>
      To get started, edit <code>src/App.jsx</code> and save to reload.
    </p>
    <button onClick={demo}>to Demo</button>
  </div>
);

Home.propTypes = {
  demo: PropTypes.func.isRequired,
};

export default connect(null, dispatch => ({
  demo: () => dispatch(push('/demo')),
}))(Home);

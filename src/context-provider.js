/**
 * @file context provider
 * @author junbinluo
 * @date 2018/3/17
 */

import React from 'react';
import {getStore} from './store-manager';

export class ContextProvider extends React.Component {
  getChildContext () {
    return {
      graxState: this.props.state
    };
  }

  render () {
    return this.props.children;
  }
}

ContextProvider.childContextTypes = {
  graxState: () => null
};

export function prepare (storeNames) {
  let states = [].concat(storeNames).map(name => {
    let store = getStore(name);
    if (!store) {
      throw new Error(`Store '${name}' has not registered`);
    }
    return Promise.resolve(store.dispatchers.init(store.getState))
      .then((state) => ({[name]: state}));
  });

  return Promise.all(states).then((states) => Object.assign({}, ...states));
}

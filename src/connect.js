import React from 'react';
import {config} from './config';
import {getStore} from './store-manager';
import {getComponentName} from './utils';


export function connect (storeNames, Component, PlaceHolder, isPure = config.defaultPure) {

  config.beforeConnect(storeNames);

  class Provider extends React.Component {

    constructor (props) {
      super(props);

      this.state = {};
      this._isDirtyFromNearly = false;
      this.store = [].concat(storeNames).map(v => getStore(v));

      this.setState = this.setState.bind(this);
    }

    // @override
    setState (state) {
      this._isDirtyFromNearly = true;
      super.setState(state, () => (this._isDirtyFromNearly = false));
    }

    initStore () {
      return this.store.map(v => v.initState());
    }

    componentWillMount () {
      this.store.forEach(v => {
        v.link(this.setState);
        v.state
          ? this.state[v.storeName] = v.getState()
          : v.initState();
      });
    }

    shouldComponentUpdate () {
      return !isPure || this._isDirtyFromNearly;
    }

    componentWillUnmount () {
      this.store.forEach(v => v.unlink(this));
    }

    render () {
      if (Object.keys(this.state).length !== this.store.length && typeof PlaceHolder !== 'undefined') {
        return PlaceHolder && React.createElement(PlaceHolder);
      }
      return React.createElement(Component, {
        ...this.props,
        _storeNames: storeNames,
        store: {
          ...this.props.store,
          ...this.state
        }
      });
    }
  }

  Provider.displayName = `${getComponentName(Component)}-${storeNames}`;
  Provider.isNearlyComponent = true;

  return Provider;
}

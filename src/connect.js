import React from 'react';
import {config} from './config';
import {getStore} from './store-manager';
import {getComponentName} from './utils';


export function connect (storeNames, Component, PlaceHolder, isPure = config.defaultPure) {

  class Provider extends React.Component {

    constructor (props) {
      super(props);
      this.setState = this.setState.bind(this);

      this._isDirtyFromNearly = false;

      config.beforeConnect(storeNames);

      this.store = [].concat(storeNames).map(v => getStore(v));
    }

    // @override
    setState (state) {
      this._isDirtyFromNearly = true;
      super.setState(state, () => (this._isDirtyFromNearly = false));
    }

    componentWillMount () {
      this.store.forEach(v => {
        v.link(this.setState);
        v.initState()
      });
    }

    shouldComponentUpdate () {
      return !isPure || this._isDirtyFromNearly;
    }

    componentWillUnmount () {
      this.store.forEach(v => v.unlink(this.setState));
    }

    render () {
      return this.state
        ? React.createElement(Component, {
          ...this.props,
          _storeNames: storeNames,
          store: {
            ...this.props.store,
            ...this.state
          }
        })
        : (PlaceHolder ? React.createElement(PlaceHolder) : false);
    }
  }

  Provider.displayName = `${getComponentName(Component)}-${storeNames}`;

  return Provider;
}

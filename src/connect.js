import React from 'react';
import {config} from './config';
import {getStore, unregisterStore} from './store';
import {getComponentName} from './utils';

export function connect(storeName, Component, PlaceHolder) {

    class Provider extends React.Component {

        constructor(props) {
            super(props);
            config.beforeConnect(storeName);
            this.store = getStore(storeName);
        }

        componentWillMount() {
            this.store.initState(this);
        }

        componentDidMount() {
            this.store.subscribe(this);
        }

        componentWillUnmount() {
            this.store.unsubscribe(this);
            // this.store = unregisterStore(storeName);
        }

        render() {
            return this.state
            ? React.createElement(Component, {
                ...this.state,
                _storeName: storeName,
                ...this.props
            })
            : (PlaceHolder ? React.createElement(PlaceHolder) : false);
        }
    }

    Provider.displayName = `${getComponentName(Component)}-${storeName}`;

    return Provider;
}

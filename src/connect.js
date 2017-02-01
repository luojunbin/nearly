import React from 'react';
import {createStore, destroyStore} from './store';
import {getComponentName} from './utils';

export default function connect(storeName, Component, PlaceHolder) {

    class Provider extends React.Component {

        constructor(props) {
            super(props);
            this.store = createStore(storeName);
        }

        componentWillMount() {
            this.store.initState(this);
        }

        componentDidMount() {
            this.store.subscribe(this);
        }

        componentWillUnmount() {
            this.store.unsubscribe(this);
            this.store = destroyStore(storeName);
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

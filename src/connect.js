import React from 'react';
import {createStore} from './store';
import {getComponentName} from './utils';

export default function connect(storeName, Component, PlaceHolder) {

    let store = createStore(storeName);

    class Provider extends React.Component {

        constructor(props) {
            super(props);
        }

        componentWillMount() {
            store.initState(this);
        }

        componentDidMount() {
            store.subscribe(this);
        }

        componentWillUnmount() {
            store.unsubscribe(this);
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

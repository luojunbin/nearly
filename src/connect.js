import React from 'react';
import {createStore} from './store';
import {getComponentName} from './utils';

export default function connect(Component, storeName) {

    let store = createStore(storeName);

    class Provider extends React.Component {

        constructor(props) {
            super(props);
            this.state = store.state;
        }

        componentDidMount() {
            store.subscribe(this);
        }

        componentWillUnmount() {
            store.unsubscribe(this);
        }

        render() {
            return <Component {...this.state} __action={storeName} {...this.props} />;
        }
    }

    Provider.displayName = `${getComponentName(Component)}-${storeName}`;

    return Provider;
}

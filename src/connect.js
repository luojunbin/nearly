import React from 'react';
import {createStore} from './store';
import {getComponentName} from './utils';

export default function connect(Component, actionFileName) {

    let store = createStore(actionFileName);

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
            return React.createElement(Component, {
                ...this.state,
                AFN: actionFileName,
                ...this.props
            });
        }
    }

    Provider.displayName = `${getComponentName(Component)}-${actionFileName}`;

    return Provider;
}

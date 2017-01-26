import React from 'react';
import {createStore} from './store';
import {getComponentName} from './utils';

export default function connect(actionFileName, Component, PlaceHolder) {

    let store = createStore(actionFileName);

    class Provider extends React.Component {

        constructor(props) {
            super(props);
            this.state = store.getState();
        }

        componentWillMount() {
            store.init(this);
        }

        componentDidMount() {
            store.subscribe(this);
        }

        componentWillUnmount() {
            store.unsubscribe(this);
        }

        render() {
            return store.isReady
            ? (PlaceHolder ? false : React.createElement(PlaceHolder))
            : React.createElement(Component, {
                ...this.state,
                AFN: actionFileName,
                ...this.props
            });
        }
    }

    Provider.displayName = `${getComponentName(Component)}-${actionFileName}`;

    return Provider;
}

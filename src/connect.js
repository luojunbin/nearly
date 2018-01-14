import React from 'react';
import {config} from './config';
import StoreManager from './store-manager';
import {getComponentName} from './utils';

export function connect(Component, isPure = config.defaultPure) {

    class Provider extends React.Component {

        constructor(props) {
            super(props);
            
            this._isDirtyFromNearly = false;

            this.setState = this.setState.bind(this);

            this.store = new StoreManager(this.setState);
        }

        // @override
        setState(state) {
            this._isDirtyFromNearly = true;
            super.setState(state, () => (this._isDirtyFromNearly = false));
        }

        shouldComponentUpdate() {
            return !isPure || this._isDirtyFromNearly;
        }

        componentWillUnmount() {
            this.store.destory();
        }

        render() {
            React.createElement(Component, {
                ...this.props,
                store: this.store
            });
        }
    }

    Provider.displayName = getComponentName(Component);

    return Provider;
}

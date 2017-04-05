
import {config} from './config';

import {getStore} from './store';

import {isPromise} from './utils';

export function dispatch(action, ...args) {
    let {store, dispatcher} = config.beforeDispatch(action);
    let state = dispatcher.apply(store, [store.getState, ...args]);

    return isPromise(state)
        ? state.then(store.dispatch)
        : store.dispatch(state);
}

export function dispatcher(...args) {
    return dispatch.bind(null, ...args);
}

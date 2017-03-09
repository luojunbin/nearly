
import {parser} from './config';

import {getStore} from './store';

import {isPromise} from './utils';

export function dispatch(action, ...args) {
    let {storeName, dispatcherName} = parser.nrSplit(action);

    let store = getStore(storeName);
    let dispatcher = parser.nrTarget(store.dispatchers, dispatcherName);

    let state = dispatcher.apply(store, [store.getState, ...args]);

    return isPromise(state)
        ? state.then(store.dispatch)
        : store.dispatch(state);
}

export function dispatcher(...args) {
    return dispatch.bind(null, ...args);
}

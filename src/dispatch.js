
import {parser} from './config';

import {getStore} from './store';

import {isPromise} from './utils';

export function dispatch(action, ...args) {
    let {modName, fnName} = parser.nrSplit(action);

    let mod = parser.nrImport(modName);

    let store = getStore(modName);

    let state = parser.nrTarget(mod, fnName).apply(mod, [store.getState, ...args]);

    return isPromise(state)
        ? state.then(stateAsync => store.dispatch(stateAsync))
        : store.dispatch(state);
}

export function dispatcher(...args) {
    return dispatch.bind(null, ...args);
}

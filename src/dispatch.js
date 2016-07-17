
import {config} from './config';

import {getStore} from './store';

import {isPromise} from './utils';

export function dispatch(path, ...args) {

    let {modName, fnName} = config.nrSplit(path);

    let mod = config.getMod(modName);

    let store = getStore(modName);

    let state = mod[fnName].apply(mod, [store.state, ...args]);

    if (isPromise(state)) {
        return state.then(function (stateAsync) {
            return store.dispatch(stateAsync);
        });
    }

    return store.dispatch(state);
}

export function dispatcher(...args) {
    return dispatch.bind(null, ...args);
}

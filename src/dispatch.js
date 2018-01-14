import {config} from './config';

export function dispatch(action, ...args) {
    let {store, dispatcher} = config.beforeDispatch(action);
    let state = dispatcher.apply(store, [store.getState, ...args]);

    return store.dispatch(state);
}

export function dispatcher(...args) {
    return dispatch.bind(null, ...args);
}

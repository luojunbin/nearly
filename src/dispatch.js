import {config} from './config';

export function dispatch (action, ...args) {
  config.beforeDispatch(action, ...args);

  let [storeName, dispatcherName] = action.split('.');

  let store = getStore(storeName);
  if (!store) {
    throw Error(`store '${storeName}' does not exist`);
  }

  let dispatcher = store.dispatchers[dispatcherName];
  if (!dispatcher) {
    throw Error(`the module does not export function ${dispatcherName}`);
  }

  let state = dispatcher.apply(store, [store.getState, ...args]);

  return store.dispatch(state);
}

export function dispatcher (...args) {
  return dispatch.bind(null, ...args);
}

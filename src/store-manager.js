import StoreModule from './store';
import {IS_BROWSER} from './env-detect';

let storeCache = {};

export function registerStore (storeName, dispatchers) {
  if (storeCache[storeName]) {
    return storeCache[storeName];
  }

  let state = IS_BROWSER && window.__GRAX_STATE__
    ? window.__GRAX_STATE__[storeName]
    : null;

  return storeCache[storeName] = new StoreModule(storeName, dispatchers, state);
}

export function getStore (storeName) {
  return storeCache[storeName];
}

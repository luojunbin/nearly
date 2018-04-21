import StoreModule from './store';
import {isBrowser} from './env-detect';

let storeCache = {};

export function registerStore (storeName, dispatchers) {
  if (storeCache[storeName]) {
    return storeCache[storeName];
  }

  let state = isBrowser
    ? window.__GRAX_STATE__[storeName]
    : null;

  return storeCache[storeName] = new StoreModule(storeName, dispatchers, state);
}

export function getStore (storeName) {
  return storeCache[storeName];
}

export function setGraxState () {
  for (let key in storeCache) {
    storeCache[key].state = null;
  }
}

// export default class StoreManager {
//     constructor(render) {
//         this.render = render;
//         this.linkedStoreState = {};
//
//         Object.keys(storeCache).forEach(storeName => this.linkState(storeName));
//
//         Object.freeze(this.linkedStoreState);
//     }
//
//     linkState(storeName) {
//         Object.defineProperty(this, storeName, {
//             get: () => {
//                 if (this.linkedStoreState[storeName]) {
//                     return this.linkedStoreState[storeName];
//                 }
//
//                 let store = storeCache[storeName];
//
//                 store.link(this.render);
//                 store.initState();
//
//                 return (this.linkedStoreState[storeName] = store.getState());
//             }
//         });
//     }
//
//     destory () {
//         Object.keys(this.linkedStoreState).forEach(storeName => storeCache[storeName].unlink(this.render));
//         this.render = null;
//         this.linkedStoreState = null;
//     }
// }

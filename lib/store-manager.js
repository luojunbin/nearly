'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.registerStore = registerStore;
exports.unregisterStore = unregisterStore;
exports.getStore = getStore;
exports.resetStore = resetStore;

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var storeCache = window.ss = {};

function registerStore(storeName, dispatchers) {
    if (storeCache[storeName]) {
        return storeCache[storeName];
    }

    return storeCache[storeName] = new _store2.default(storeName, dispatchers);
}

function unregisterStore(storeName) {
    if (storeCache[storeName].renders.length === 0) {
        storeCache[storeName] = undefined;
    }
}

function getStore(storeName) {
    return storeCache[storeName];
}

function resetStore() {
    for (var key in storeCache) {
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
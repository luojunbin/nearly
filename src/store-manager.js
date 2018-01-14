import StoreModule from './store';

let storeCache = {};

export function registerStore(storeName, dispatchers) {
    if (storeCache[storeName]) {
        return storeCache[storeName];
    }

    return storeCache[storeName] = new StoreModule(storeName, dispatchers);
}

export function unregisterStore(storeName) {
    if (storeCache[storeName].renders.length === 0) {
        storeCache[storeName] = undefined;
    }
}

export function getStore(storeName) {
    return storeCache[storeName];
}

export default class StoreManager {
    constructor(render) {
        this.render = render;
        this.linkedStoreState = {};

        Object.keys(storeCache).forEach(storeName => this.linkState(storeName));

        Object.freeze(this.linkedStoreState);
    }

    linkState(storeName) {
        Object.defineProperty(this, storeName, {
            get: () => {
                if (this.linkedStoreState[storeName]) {
                    return this.linkedStoreState[storeName];
                }

                let store = storeCache[storeName];

                store.link(this.render);
                store.initState();

                return (this.linkedStoreState[storeName] = store.getState());
            }
        });
    }

    destory () {
        Object.keys(this.linkedStoreState).forEach(storeName => storeCache[storeName].unlink(this.render));
        this.render = null;
        this.linkedStoreState = null;
    }
}

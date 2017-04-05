import {isPromise} from './utils';

class Store {

    constructor(storeName, dispatchers) {

        this.storeName = storeName;

        this.state = null;
        this.components = [];

        this.getState = this.getState.bind(this);
        this.dispatch = this.dispatch.bind(this);

        this.dispatchers = dispatchers;
    }

    getState() {
        return {...this.state};
    }

    initState(component) {
        if (this.components.length > 0) {
            return;
        }

        if (typeof this.dispatchers.init !== 'function') {
            throw Error(`'init' of Dispatcher file ${this.storeName} does not exist`);
        }

        let state = this.dispatchers.init(this.getState);

        isPromise(state)
        ? state.then(this.dispatch)
        : component.state = this.state = state;
    }

    subscribe(component) {
        this.components.push(component);
    }

    unsubscribe(component) {
        this.components = this.components.filter(v => v !== component);
    }

    dispatch(state) {
        if (state !== null) {
            this.state = {...this.state, ...state};
            this.components.forEach(v => v.setState(this.state));
        }

        return this.state;
    }
}

let storeCache = {};

export function registerStore(storeName, dispatchers) {
    if (storeCache[storeName]) {
        return storeCache[storeName];
    }

    return storeCache[storeName] = new Store(storeName, dispatchers);
}

export function unregisterStore(storeName) {
    if (storeCache[storeName].components.length === 0) {
        storeCache[storeName] = undefined;
    }
}

export function getStore(storeName) {
    return storeCache[storeName];
}

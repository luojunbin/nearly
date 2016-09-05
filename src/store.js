import {parser} from './config';

class Store {

    constructor(modName) {
        let mod = parser.nrImport(modName);

        this.state = mod.getState ? mod.getState() : {};

        this.components = [];
    }

    subscribe(component) {
        this.components.push(component);
    }

    unsubscribe(component) {
        this.components = this.components.filter(v => v !== component);
    }

    dispatch(state) {

        if (state === this.state) {
            throw Error('must not modify origin state, if you change nothing, please return {} or null');
        }

        if (state !== null) {
            this.state = {...this.state, ...state};
            this.components.forEach(v => v.setState(this.state));
        }

        return this.state;
    }

}

export let storeCache = {};

export function createStore(modName) {

    if (storeCache[modName]) {
        return storeCache[modName];
    }

    return storeCache[modName] = new Store(modName);
}

export function getStore(modName) {
    return storeCache[modName];
}

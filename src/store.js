import {parser} from './config';

class Store {

    constructor(modName) {
        let mod = parser.nrImport(modName);

        if (typeof mod.getInitailState !== 'function') {
            throw Error(`'getInitailState' of Action file ${modName} does not exist`);
        }

        this.state = mod.getInitailState();

        this.components = [];
        this.getState = this.getState.bind(this);
    }

    getState() {
        return {...this.state};
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

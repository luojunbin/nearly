import {parser} from './config';
import {isPromise} from './utils';

class Store {

    constructor(modName) {

        this.modName = modName;

        this.state = null;
        this.components = [];
        this.getState = this.getState.bind(this);
    }

    getState() {
        return {...this.state};
    }

    init(component) {
        let mod = parser.nrImport(this.modName);

        if (typeof mod.getInitialState !== 'function') {
            throw Error(`'getInitialState' of Action file ${modName} does not exist`);
        }

        let state = mod.getInitialState();

        isPromise(state)
        ? state.then(stateAsync => this.dispatch(stateAsync))
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

// 不能直接导出内部的方法, 这些方法会被改变
import config from './config';

class Store {

    constructor(modName) {
        let mod = config.parser.getMod(modName);

        this.state = mod.getState ? mod.getState() : {};

        this.renders = [];
    }

    subscribe(component) {
        this.renders.push(component);
    }

    unsubscribe(component) {
        this.renders = this.renders.filter(v => v !== component);
    }

    dispatch(state) {

        if (state === this.state) {
            throw Error('must not modify origin state, if you change nothing, please return {} or null');
        }

        if (state !== null) {
            this.state = {...this.state, ...state};
            this.renders.forEach(v => v.setState(this.state));
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

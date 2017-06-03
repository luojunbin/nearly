import {registerStore, getStore} from './store';

export let config = {
    defaultPure: false,

    beforeConnect(storeName) {
        // let realName = storeName.split('#')[0];

        // return registerStore(storeName, require(`./${realName}.js`));
    },

    beforeDispatch(action) {
        let [storeName, dispatcherName] = action.split('::');

        let store = getStore(storeName);
        if (!store) {
            throw Error(`store '${storeName}' does not exist`);
        }

        let dispatcher = store.dispatchers[dispatcherName];
        if (!dispatcher) {
            throw Error(`the module does not export function ${dispatcherName}`);
        }

        return {store, dispatcher};        
    }
}

export function configure(opt) {
    for (let key in opt) {
        config.hasOwnProperty(key) && (config[key] = opt[key]);
    }
}

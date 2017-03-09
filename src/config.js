
export let parser = {
    nrSplit(str) {
        let [storeName, dispatcherName] = str.split('::');

        return {storeName, dispatcherName};
    },

    nrImport(storeName) {
        let realName = storeName.split('#')[0];

        return require(`./${realName}.js`);
    },

    nrTarget(mod, functionName) {
        if (mod[functionName]) {
            return mod[functionName];
        }

        switch (functionName) {
            case 'testState':
                return (prevState, state) => state;
        }

        throw Error(`the module does not export function ${functionName}`);
    }
};

export let config = {parser};

export function configure(type, opt) {
    if (config[type] === undefined) {
        throw Error(`configure does not supports ${type}`);
    }

    for (let key in opt) {
        config[type].hasOwnProperty(key) && (config[type][key] = opt[key]);
    }
}




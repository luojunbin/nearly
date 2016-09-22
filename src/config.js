
export let parser = {
    nrSplit(str) {
        let [modName, fnName] = str.split('::');

        return {modName, fnName};
    },

    nrImport(modName) {
        let realName = modName.split('#')[0];

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




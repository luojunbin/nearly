
let parser = {
    nrSplit(str) {
        let [modName, fnName] = str.split('::');

        return {modName, fnName};
    },

    nrImport(modName) {
        let realName = modName.split('#')[0];

        return require(`./${realName}.js`);
    }
}

export let config = {parser};

export function configure(type, opt) {
    if (config[type] === undefined) {
        throw Error(`configure does not supports ${type}`);
    }

    config[type] = {...config[type], ...opt};
}




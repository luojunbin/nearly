

function nrSplit(str) {
    let [modName, fnName] = str.split('::');

    return {modName, fnName};
}

function getMod(modName) {
    let realName = modName.split('#')[0];

    return require(`./${realName}.js`);
}

export let config = {nrSplit, getMod};

export function configure(opt) {
    config = {...config, ...opt};
}




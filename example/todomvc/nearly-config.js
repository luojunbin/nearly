import {configure} from 'nearly';

function nrSplit(str) {
    let [modName, fnName] = str.split('::');

    return {modName, fnName};
}

function getMod(modName) {
    let realName = modName.split('#')[0];
    // babel 的 import 不能在 function 中, 用 require 代替
    return require(`./actions/${realName}.js`);
}

export default configure('parser', {nrSplit, getMod});

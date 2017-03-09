import {configure} from 'nearly-react';

function nrSplit(str) {
    let [storeName, dispatcherName] = str.split('::');

    return {storeName, dispatcherName};
}

function nrImport(storeName) {
    let realName = storeName.split('#')[0];
    // babel 的 import 不能在 function 中, 用 require 代替
    return require(`./actions/${realName}.js`);
}

export default configure('parser', {nrSplit, nrImport});

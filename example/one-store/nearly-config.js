/**
 * @file 配置 grax
 */

import {configure, getStore, registerStore} from 'grax-react';

configure({
    beforeConnect(storeName) {
        let store = getStore(storeName);

        if (!store) {
            let realName = storeName.split('#')[0];
            registerStore(storeName, require(`./actions/${realName}.js`));
        }
    }
});
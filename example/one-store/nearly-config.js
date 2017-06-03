/**
 * @file 配置 nearly
 */

import {configure, getStore, registerStore} from 'nearly-react';

configure({
    beforeConnect(storeName) {
        let store = getStore(storeName);

        if (!store) {
            let realName = storeName.split('#')[0];
            registerStore(storeName, require(`./actions/${realName}.js`));
        }
    }
});
/**
 * @file 配置 grax
 */

import {configure, getStore, registerStore, clearStore} from 'grax-react';

configure({
    beforeConnect(storeNames) {
      [].concat(storeNames).forEach(storeName => {
        let store = getStore(storeName);

        if (!store) {
          let realName = storeName.split('#')[0];
          registerStore(storeName, require(`./actions/${realName}.js`));
        }
      })
    }
});
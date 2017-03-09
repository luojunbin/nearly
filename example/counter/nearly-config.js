/**
 * @file 配置 nearly
 */

import {configure} from 'nearly-react';

// 可供配置的方法有 nrSplit, nrImport 和 nrTarget
// 这里只配置 nrImport, 其余两个使用默认配置
configure('parser', {
    // 根据获得的 storeName 去指定路径下 require 相应模块
    nrImport(storeName) {
        console.log(storeName);
        let realName = storeName.split('#')[0];
        // 根据模块名, 去 actions 目录下引用相应模块
        return require(`./actions/${realName}.js`);
    }
});
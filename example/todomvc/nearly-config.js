import {configure, registerStore} from 'nearly-react';

export default configure({
    beforeConnect(storeName) {
        let realName = storeName.split('#')[0];

        return registerStore(storeName, require(`./actions/${realName}.js`));
    }
});

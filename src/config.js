import {getStore} from './store-manager';

export let config = {
  defaultPure: false,

  beforeConnect (storeName) {
    // let realName = storeName.split('#')[0];

    // return registerStore(storeName, require(`./${realName}.js`));
  },

  beforeDispatch (action) {

  }
};

export function configure (opt) {
  for (let key in opt) {
    config.hasOwnProperty(key) && (config[key] = opt[key]);
  }
}

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerStore = registerStore;
exports.getStore = getStore;

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _envDetect = require('./env-detect');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var storeCache = {};

function registerStore(storeName, dispatchers) {
  if (storeCache[storeName]) {
    return storeCache[storeName];
  }

  var state = _envDetect.IS_BROWSER && window.__GRAX_STATE__ ? window.__GRAX_STATE__[storeName] : null;

  return storeCache[storeName] = new _store2.default(storeName, dispatchers, state);
}

function getStore(storeName) {
  return storeCache[storeName];
}
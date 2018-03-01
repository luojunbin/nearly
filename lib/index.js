'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _connect = require('./connect');

Object.defineProperty(exports, 'connect', {
  enumerable: true,
  get: function get() {
    return _connect.connect;
  }
});

var _storeManager = require('./store-manager');

Object.defineProperty(exports, 'getStore', {
  enumerable: true,
  get: function get() {
    return _storeManager.getStore;
  }
});
Object.defineProperty(exports, 'registerStore', {
  enumerable: true,
  get: function get() {
    return _storeManager.registerStore;
  }
});
Object.defineProperty(exports, 'resetStore', {
  enumerable: true,
  get: function get() {
    return _storeManager.resetStore;
  }
});

var _dispatch = require('./dispatch');

Object.defineProperty(exports, 'dispatch', {
  enumerable: true,
  get: function get() {
    return _dispatch.dispatch;
  }
});
Object.defineProperty(exports, 'dispatcher', {
  enumerable: true,
  get: function get() {
    return _dispatch.dispatcher;
  }
});

var _config = require('./config');

Object.defineProperty(exports, 'configure', {
  enumerable: true,
  get: function get() {
    return _config.configure;
  }
});
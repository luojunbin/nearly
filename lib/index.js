'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configure = exports.dispatcher = exports.dispatch = exports.connect = exports.createStore = exports.getStore = undefined;

var _store = require('./store');

var _connect = require('./connect');

var _connect2 = _interopRequireDefault(_connect);

var _dispatch = require('./dispatch');

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.getStore = _store.getStore;
exports.createStore = _store.createStore;
exports.connect = _connect2.default;
exports.dispatch = _dispatch.dispatch;
exports.dispatcher = _dispatch.dispatcher;
exports.configure = _config.configure;
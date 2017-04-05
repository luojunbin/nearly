'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.dispatch = dispatch;
exports.dispatcher = dispatcher;

var _config = require('./config');

var _store = require('./store');

var _utils = require('./utils');

function dispatch(action) {
    var _config$parse = _config.config.parse(action);

    var store = _config$parse.store;
    var dispatcher = _config$parse.dispatcher;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    var state = dispatcher.apply(store, [store.getState].concat(args));

    return (0, _utils.isPromise)(state) ? state.then(store.dispatch) : store.dispatch(state);
}

function dispatcher() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
    }

    return dispatch.bind.apply(dispatch, [null].concat(args));
}
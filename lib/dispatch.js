'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.dispatch = dispatch;
exports.dispatcher = dispatcher;

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _store = require('./store');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function dispatch(path) {
    var _config$parser$nrSpli = _config2.default.parser.nrSplit(path);

    var modName = _config$parser$nrSpli.modName;
    var fnName = _config$parser$nrSpli.fnName;


    var mod = _config2.default.parser.nrImport(modName);

    var store = (0, _store.getStore)(modName);

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    var state = mod[fnName].apply(mod, [store.state].concat(args));

    if ((0, _utils.isPromise)(state)) {
        return state.then(function (stateAsync) {
            return store.dispatch(stateAsync);
        });
    }

    return store.dispatch(state);
}

function dispatcher() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
    }

    return dispatch.bind.apply(dispatch, [null].concat(args));
}
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.config = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.configure = configure;

var _store = require('./store');

var config = exports.config = {
    beforeConnect: function beforeConnect(storeName) {
        // let realName = storeName.split('#')[0];

        // return registerStore(storeName, require(`./${realName}.js`));
    },
    beforeDispatch: function beforeDispatch(action) {
        var _action$split = action.split('::');

        var _action$split2 = _slicedToArray(_action$split, 2);

        var storeName = _action$split2[0];
        var dispatcherName = _action$split2[1];


        var store = (0, _store.getStore)(storeName);
        if (!store) {
            throw Error('store \'' + storeName + '\' does not exist');
        }

        var dispatcher = store.dispatchers[dispatcherName];
        if (!dispatcher) {
            throw Error('the module does not export function ' + dispatcherName);
        }

        return { store: store, dispatcher: dispatcher };
    }
};

function configure(opt) {
    for (var key in opt) {
        config.hasOwnProperty(key) && (config[key] = opt[key]);
    }
}
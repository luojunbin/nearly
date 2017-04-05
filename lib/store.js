'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.registerStore = registerStore;
exports.unregisterStore = unregisterStore;
exports.getStore = getStore;

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Store = function () {
    function Store(storeName, dispatchers) {
        _classCallCheck(this, Store);

        this.storeName = storeName;

        this.state = null;
        this.components = [];

        this.getState = this.getState.bind(this);
        this.dispatch = this.dispatch.bind(this);

        this.dispatchers = dispatchers;
    }

    _createClass(Store, [{
        key: 'getState',
        value: function getState() {
            return _extends({}, this.state);
        }
    }, {
        key: 'initState',
        value: function initState(component) {
            if (this.components.length > 0) {
                return;
            }

            if (typeof this.dispatchers.init !== 'function') {
                throw Error('\'init\' of Dispatcher file ' + this.storeName + ' does not exist');
            }

            var state = this.dispatchers.init(this.getState);

            (0, _utils.isPromise)(state) ? state.then(this.dispatch) : component.state = this.state = state;
        }
    }, {
        key: 'subscribe',
        value: function subscribe(component) {
            this.components.push(component);
        }
    }, {
        key: 'unsubscribe',
        value: function unsubscribe(component) {
            this.components = this.components.filter(function (v) {
                return v !== component;
            });
        }
    }, {
        key: 'dispatch',
        value: function dispatch(state) {
            var _this = this;

            if (state !== null) {
                this.state = _extends({}, this.state, state);
                this.components.forEach(function (v) {
                    return v.setState(_this.state);
                });
            }

            return this.state;
        }
    }]);

    return Store;
}();

var storeCache = {};

function registerStore(storeName, dispatchers) {
    if (storeCache[storeName]) {
        return storeCache[storeName];
    }

    return storeCache[storeName] = new Store(storeName, dispatchers);
}

function unregisterStore(storeName) {
    if (storeCache[storeName].components.length === 0) {
        storeCache[storeName] = undefined;
    }
}

function getStore(storeName) {
    return storeCache[storeName];
}
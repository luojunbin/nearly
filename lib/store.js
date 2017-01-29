'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.storeCache = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createStore = createStore;
exports.getStore = getStore;

var _config = require('./config');

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Store = function () {
    function Store(modName) {
        _classCallCheck(this, Store);

        this.modName = modName;

        this.state = null;
        this.components = [];
        this.getState = this.getState.bind(this);
    }

    _createClass(Store, [{
        key: 'getState',
        value: function getState() {
            return _extends({}, this.state);
        }
    }, {
        key: 'initState',
        value: function initState(component) {
            var _this = this;

            var mod = _config.parser.nrImport(this.modName);

            if (typeof mod.init !== 'function') {
                throw Error('\'init\' of Action file ' + this.modName + ' does not exist');
            }

            var state = mod.init();

            (0, _utils.isPromise)(state) ? state.then(function (stateAsync) {
                return _this.dispatch(stateAsync);
            }) : component.state = this.state = state;
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
            var _this2 = this;

            if (state !== null) {
                this.state = _extends({}, this.state, state);
                this.components.forEach(function (v) {
                    return v.setState(_this2.state);
                });
            }

            return this.state;
        }
    }]);

    return Store;
}();

var storeCache = exports.storeCache = {};

function createStore(modName) {
    if (storeCache[modName]) {
        return storeCache[modName];
    }

    return storeCache[modName] = new Store(modName);
}

function getStore(modName) {
    return storeCache[modName];
}
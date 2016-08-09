'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.storeCache = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // 不能直接导出内部的方法, 这些方法会被改变


exports.createStore = createStore;
exports.getStore = getStore;

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Store = function () {
    function Store(modName) {
        _classCallCheck(this, Store);

        var mod = _config2.default.parser.getMod(modName);

        this.state = mod.getState ? mod.getState() : {};

        this.renders = [];
    }

    _createClass(Store, [{
        key: 'subscribe',
        value: function subscribe(component) {
            this.renders.push(component);
        }
    }, {
        key: 'unsubscribe',
        value: function unsubscribe(component) {
            this.renders = this.renders.filter(function (v) {
                return v !== component;
            });
        }
    }, {
        key: 'dispatch',
        value: function dispatch(state) {
            var _this = this;

            if (state === this.state) {
                throw Error('must not modify origin state, if you change nothing, please return {} or null');
            }

            if (state !== null) {
                this.state = _extends({}, this.state, state);
                this.renders.forEach(function (v) {
                    return v.setState(_this.state);
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
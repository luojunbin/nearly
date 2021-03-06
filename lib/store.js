'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.registerStore = registerStore;
exports.getStore = getStore;

var _utils = require('./utils');

var _envDetect = require('./env-detect');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StoreModule = function () {
  function StoreModule(name, dispatchers, state) {
    _classCallCheck(this, StoreModule);

    this.name = name;

    this.state = state;
    this.isPending = false;
    this.renderHandlers = [];
    this.dispatchers = dispatchers;

    this.getState = this.getState.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.syncDispatch = this.syncDispatch.bind(this);
  }

  _createClass(StoreModule, [{
    key: 'getState',
    value: function getState(storeName) {
      if (typeof storeName === 'string') {
        return getStore(storeName).getState();
      }
      return _extends({}, this.state);
    }
  }, {
    key: 'initState',
    value: function initState() {
      var _this = this;

      if (typeof this.dispatchers.init !== 'function') {
        throw Error('can not find \'init\' of store: ' + this.name);
      }

      if (this.isPending) {
        return null;
      }

      var state = this.dispatchers.init(this.getState);

      if ((0, _utils.isThenable)(state)) {
        this.isPending = true;
        return state.then(function (state) {
          _this.isPending = false;
          _this.syncDispatch(state);
        });
      }

      return this.syncDispatch(state);
    }
  }, {
    key: 'link',
    value: function link(renderHandler) {
      this.renderHandlers.push(renderHandler);
    }
  }, {
    key: 'unlink',
    value: function unlink(renderHandler) {
      this.renderHandlers = this.renderHandlers.filter(function (v) {
        return v !== renderHandler;
      });
    }
  }, {
    key: 'dispatch',
    value: function dispatch(state) {
      return Promise.resolve(state).then(this.syncDispatch);
    }
  }, {
    key: 'syncDispatch',
    value: function syncDispatch(state) {
      var _this2 = this;

      if (state !== null) {
        this.state = _extends({}, this.state, state);
        this.renderHandlers.forEach(function (renderHandler) {
          return renderHandler(_defineProperty({}, _this2.name, _this2.getState()));
        });
      }

      return this.state;
    }
  }]);

  return StoreModule;
}();

var storeCache = {};

function registerStore(storeName, dispatchers) {
  if (storeCache[storeName]) {
    return storeCache[storeName];
  }

  var state = _envDetect.IS_BROWSER && window.__GRAX_STATE__ ? window.__GRAX_STATE__[storeName] : null;

  return storeCache[storeName] = new StoreModule(storeName, dispatchers, state);
}

function getStore(storeName) {
  return storeCache[storeName];
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContextProvider = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.prepare = prepare;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _storeManager = require('./store-manager');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file context provider
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author junbinluo
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @date 2018/3/17
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ContextProvider = exports.ContextProvider = function (_React$Component) {
  _inherits(ContextProvider, _React$Component);

  function ContextProvider() {
    _classCallCheck(this, ContextProvider);

    return _possibleConstructorReturn(this, (ContextProvider.__proto__ || Object.getPrototypeOf(ContextProvider)).apply(this, arguments));
  }

  _createClass(ContextProvider, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        graxState: this.props.state
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);

  return ContextProvider;
}(_react2.default.Component);

ContextProvider.childContextTypes = {
  graxState: function graxState() {
    return null;
  }
};

function prepare(storeNames) {
  var states = [].concat(storeNames).map(function (name) {
    var store = (0, _storeManager.getStore)(name);
    if (!store) {
      throw new Error('Store \'' + name + '\' has not registered');
    }
    return Promise.resolve(store.dispatchers.init(store.getState)).then(function (state) {
      return _defineProperty({}, name, state);
    });
  });

  return Promise.all(states).then(function (states) {
    return Object.assign.apply(Object, [{}].concat(_toConsumableArray(states)));
  });
}
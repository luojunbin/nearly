'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContextProvider = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.prepare = prepare;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _store = require('./store');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var statesPromise = [].concat(storeNames).map(function (name) {
    var _store$dispatchers;

    var store = (0, _store.getStore)(name);
    if (!store) {
      throw new Error('Store \'' + name + '\' has not registered');
    }
    return Promise.resolve((_store$dispatchers = store.dispatchers).init.apply(_store$dispatchers, [store.getState].concat(args))).then(function (state) {
      return _defineProperty({}, name, state);
    });
  });

  return Promise.all(statesPromise).then(function (states) {
    return states.reduce(function (p, n) {
      return _extends({}, p, n);
    });
  });
}
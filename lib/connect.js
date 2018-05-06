'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.connect = connect;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _config = require('./config');

var _storeManager = require('./store-manager');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function connect(storeNames, Component, PlaceHolder) {
  var isPure = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _config.config.defaultPure;


  _config.config.beforeConnect(storeNames);

  var Provider = function (_React$Component) {
    _inherits(Provider, _React$Component);

    function Provider(props) {
      _classCallCheck(this, Provider);

      var _this = _possibleConstructorReturn(this, (Provider.__proto__ || Object.getPrototypeOf(Provider)).call(this, props));

      _this.state = {};
      _this._isDirtyFromGrax = false;
      _this.store = [].concat(storeNames).map(function (v) {
        return (0, _storeManager.getStore)(v);
      });

      _this.setState = _this.setState.bind(_this);
      return _this;
    }

    // @override


    _createClass(Provider, [{
      key: 'setState',
      value: function setState(state) {
        var _this2 = this;

        this._isDirtyFromGrax = true;
        _get(Provider.prototype.__proto__ || Object.getPrototypeOf(Provider.prototype), 'setState', this).call(this, state, function () {
          return _this2._isDirtyFromGrax = false;
        });
      }
    }, {
      key: 'initStore',
      value: function initStore() {
        return this.store.map(function (v) {
          return v.initState();
        });
      }
    }, {
      key: 'componentWillMount',
      value: function componentWillMount() {
        var _this3 = this;

        this.store.forEach(function (v) {
          // ssr mode
          if (_this3.context.graxState) {
            _this3.state[v.name] = _this3.context.graxState[v.name];
          } else {
            v.link(_this3.setState);
            v.state ? _this3.state[v.name] = v.getState() : v.initState();
          }
        });
      }
    }, {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate() {
        return !isPure || this._isDirtyFromGrax;
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        var _this4 = this;

        this.store.forEach(function (v) {
          return v.unlink(_this4);
        });
      }
    }, {
      key: 'render',
      value: function render() {
        if (Object.keys(this.state).length !== this.store.length && typeof PlaceHolder !== 'undefined') {
          return PlaceHolder && _react2.default.createElement(PlaceHolder);
        }
        return _react2.default.createElement(Component, _extends({}, this.props, {
          storeNames: storeNames,
          store: _extends({}, this.props.store, this.state)
        }));
      }
    }]);

    return Provider;
  }(_react2.default.Component);

  Provider.displayName = (0, _utils.getComponentName)(Component) + '-' + storeNames;
  Provider.isGraxComponent = true;
  Provider.contextTypes = {
    graxState: function graxState() {
      return null;
    }
  };

  return Provider;
}
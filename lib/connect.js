'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.connect = connect;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _store = require('./store');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function connect(storeName, Component, PlaceHolder) {
    var Provider = function (_React$Component) {
        _inherits(Provider, _React$Component);

        function Provider(props) {
            _classCallCheck(this, Provider);

            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Provider).call(this, props));

            _this.store = (0, _store.registerStore)(storeName);
            return _this;
        }

        _createClass(Provider, [{
            key: 'componentWillMount',
            value: function componentWillMount() {
                this.store.initState(this);
            }
        }, {
            key: 'componentDidMount',
            value: function componentDidMount() {
                this.store.subscribe(this);
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                this.store.unsubscribe(this);
                this.store = (0, _store.unregisterStore)(storeName);
            }
        }, {
            key: 'render',
            value: function render() {
                return this.state ? _react2.default.createElement(Component, _extends({}, this.state, {
                    _storeName: storeName
                }, this.props)) : PlaceHolder ? _react2.default.createElement(PlaceHolder) : false;
            }
        }]);

        return Provider;
    }(_react2.default.Component);

    Provider.displayName = (0, _utils.getComponentName)(Component) + '-' + storeName;

    return Provider;
}
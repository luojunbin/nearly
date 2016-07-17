(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["Nearly"] = factory(require("react"));
	else
		root["Nearly"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_8__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(6);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	exports.configure = configure;


	function nrSplit(str) {
	    var _str$split = str.split('::');

	    var _str$split2 = _slicedToArray(_str$split, 2);

	    var modName = _str$split2[0];
	    var fnName = _str$split2[1];


	    return { modName: modName, fnName: fnName };
	}

	function getMod(modName) {
	    var realName = modName.split('#')[0];

	    return __webpack_require__(7)("./" + realName + '.js');
	}

	var config = exports.config = { nrSplit: nrSplit, getMod: getMod };

	function configure(opt) {
	    exports.config = config = _extends({}, config, opt);
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.storeCache = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // 不能直接导出内部的方法, 这些方法会被改变


	exports.createStore = createStore;
	exports.getStore = getStore;

	var _config = __webpack_require__(1);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Store = function () {
	    function Store(modName) {
	        _classCallCheck(this, Store);

	        var mod = _config.config.getMod(modName);

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

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.isPromise = isPromise;
	exports.getComponentName = getComponentName;

	// 判断是不是 promise 的对象, 弱判断;
	function isPromise(obj) {
	    return !!obj && (obj instanceof Promise || typeof obj.then === 'function');
	}

	function getComponentName(Component) {
	    return Component.name || Component.displayName || 'Component';
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.default = connect;

	var _react = __webpack_require__(8);

	var _react2 = _interopRequireDefault(_react);

	var _store = __webpack_require__(2);

	var _utils = __webpack_require__(3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function connect(Component, storeName) {

	    var store = (0, _store.createStore)(storeName);

	    var Provider = function (_React$Component) {
	        _inherits(Provider, _React$Component);

	        function Provider(props) {
	            _classCallCheck(this, Provider);

	            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Provider).call(this, props));

	            _this.state = store.state;
	            return _this;
	        }

	        _createClass(Provider, [{
	            key: 'componentDidMount',
	            value: function componentDidMount() {
	                store.subscribe(this);
	            }
	        }, {
	            key: 'componentWillUnmount',
	            value: function componentWillUnmount() {
	                store.unsubscribe(this);
	            }
	        }, {
	            key: 'render',
	            value: function render() {
	                return _react2.default.createElement(Component, _extends({}, this.state, { __action: storeName }, this.props));
	            }
	        }]);

	        return Provider;
	    }(_react2.default.Component);

	    Provider.displayName = (0, _utils.getComponentName)(Component) + '-' + storeName;

	    return Provider;
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.dispatch = dispatch;
	exports.dispatcher = dispatcher;

	var _config = __webpack_require__(1);

	var _store = __webpack_require__(2);

	var _utils = __webpack_require__(3);

	function dispatch(path) {
	    var _config$nrSplit = _config.config.nrSplit(path);

	    var modName = _config$nrSplit.modName;
	    var fnName = _config$nrSplit.fnName;


	    var mod = _config.config.getMod(modName);

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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.configure = exports.dispatcher = exports.dispatch = exports.connect = exports.createStore = exports.getStore = undefined;

	var _store = __webpack_require__(2);

	var _connect = __webpack_require__(4);

	var _connect2 = _interopRequireDefault(_connect);

	var _dispatch = __webpack_require__(5);

	var _config = __webpack_require__(1);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.getStore = _store.getStore;
	exports.createStore = _store.createStore;
	exports.connect = _connect2.default;
	exports.dispatch = _dispatch.dispatch;
	exports.dispatcher = _dispatch.dispatcher;
	exports.configure = _config.configure;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./config.js": 1,
		"./connect.js": 4,
		"./dispatch.js": 5,
		"./index.js": 6,
		"./store.js": 2,
		"./utils.js": 3
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 7;


/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ }
/******/ ])
});
;
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Validation"] = factory();
	else
		root["Validation"] = factory();
})(this, function() {
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

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Messages = exports.FormValidation = exports.Validator = exports.Validation = undefined;

	var _Validation2 = __webpack_require__(1);

	var _Validation3 = _interopRequireDefault(_Validation2);

	var _Validator2 = __webpack_require__(4);

	var _Validator3 = _interopRequireDefault(_Validator2);

	var _FormValidation2 = __webpack_require__(7);

	var _FormValidation3 = _interopRequireDefault(_FormValidation2);

	var _Messages2 = __webpack_require__(5);

	var _Messages3 = _interopRequireDefault(_Messages2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.Validation = _Validation3.default;
	exports.Validator = _Validator3.default;
	exports.FormValidation = _FormValidation3.default;
	exports.Messages = _Messages3.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _events = __webpack_require__(2);

	var _events2 = _interopRequireDefault(_events);

	var _dom = __webpack_require__(3);

	var _dom2 = _interopRequireDefault(_dom);

	var _Validator = __webpack_require__(4);

	var _Validator2 = _interopRequireDefault(_Validator);

	var _AssistAdvice = __webpack_require__(6);

	var _AssistAdvice2 = _interopRequireDefault(_AssistAdvice);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 表单验证组件
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	var Validation = function (_EventEmitter) {
	  _inherits(Validation, _EventEmitter);

	  _createClass(Validation, null, [{
	    key: 'validate',


	    /**
	     * 使用一个验证规则对值进行验证
	     *
	     * @param {String} value  - 值
	     * @param {Object} rule   - 规则
	     *  - type | validate: {String|Regexp|Function}
	     *  - force    是否强制校验，默认空串不进行校验
	     * @param {Validation}  o  - [可选] 当前验证对象，将作为上下文传递给验证器
	     * @param {Object} options - [可选] 验证的额外参数
	     * @return {Boolean}       - 验证结果
	     */
	    value: function validate(value, rule, o, options) {
	      // validate is for regexp or function
	      var type = rule.type || rule.validate;
	      if (!type) {
	        throw new Error('validate rule required.');
	      }

	      // required
	      if (type === 'required') {
	        return !!value;
	      }

	      // empty value return true for default
	      if (!value && !rule.force) {
	        return true;
	      }

	      var v = type;
	      if (typeof type === 'string') {
	        v = Validation.Validator[type];
	        if (!v) {
	          throw new Error('invalid validator: ' + type);
	        }
	      }

	      return typeof v === 'function' ? v.call(o, value, rule, options) : typeof v.test === 'function' ? v.test(value) : true;
	    }

	    /**
	     * 构造一个验证器用于验证一个表单控件
	     *
	     * @param {Element} elm   - 表单元素
	     * @param {Array} options - 验证配置
	     *  {
	     *    advice: {String}  - 出错提示方式，默认为'default'
	     *    handler: {String} - 处理方式，默认为'default'
	     *    rules:  - 验证规则
	     *    [
	     *      {
	     *        type: {String}    - 验证器名称
	     *        param: {String|Array|Object} - 验证器参数，如果没有, 当前rule对象将作为参数
	     *        message|error: {String} - 出错信息
	     *        prompt: {String}        - 提示信息
	     *        success: {String}       - 验证成功信息
	     *        force: {Boolean}        - 为空时是否强制校验
	     *        not: {Boolean}          - 反向校验
	     *      }
	     *    ]
	     *  }
	     */

	  }]);

	  function Validation(elm, options) {
	    _classCallCheck(this, Validation);

	    var _this = _possibleConstructorReturn(this, (Validation.__proto__ || Object.getPrototypeOf(Validation)).call(this));

	    if (!elm || elm.nodeType !== 1) {
	      throw new Error('invalid element for validation, it should be a dom element.');
	    }

	    options = options || {};

	    // 当前元素
	    _this.elm = elm;

	    // 允许仅仅指定rules
	    _this.options = options.rules ? options : { rules: options };

	    var _this$options$rules = _this.options.rules;
	    var rules = _this$options$rules === undefined ? [] : _this$options$rules;

	    // 验证规则

	    _this.rules = Array.isArray(rules) ? rules : [rules];

	    // advice用于处理提示信息
	    _this.advice = createAdvice(_this, options.advice || 'default');

	    // handler用于挂接表单元素事件
	    _this.handler = Validation.Handler[options.handler || 'default'];

	    // 挂接验证事件
	    _this.handler.call(_this, _this);

	    // 提示信息映射表
	    _this.messages = options.messages;

	    // 是否开启
	    _this.enabled = true;
	    return _this;
	  }

	  /**
	   * 开启验证
	   */


	  _createClass(Validation, [{
	    key: 'enable',
	    value: function enable() {
	      this.enabled = true;
	    }

	    /**
	     * 关闭验证
	     */

	  }, {
	    key: 'disable',
	    value: function disable() {
	      this.enabled = false;
	      this.advice.prompt();
	    }

	    /**
	     * 验证表单元素
	     *
	     * @param {Object} options   -  配置项
	     *  noAdvice {Boolean}  - 仅验证不进行提示
	     *  from {String}       - 验证来源
	     *
	     * @return {Boolean}         - 验证结果
	     */
	    /* eslint complexity: [2, 12], max-statements: [2, 22] */

	  }, {
	    key: 'validate',
	    value: function validate(options) {
	      options = options || {};

	      var elm = (0, _dom2.default)(this.elm);
	      // 如果验证器关闭，或者表单元素`disabled`忽略此验证
	      if (!this.enabled || elm.get().disabled || elm.hasClass('disabled')) {
	        return true;
	      }

	      var value = elm.val();
	      value = typeof value === 'string' ? value.trim() : value;

	      // 允许调用时使用自定义rules进行校验
	      var rules = options.rules || this.rules;

	      var valid = true;
	      var rule = null;

	      this.current = null; // current rule
	      this.errorMessage = null;

	      for (var i = 0, c = rules.length; i < c; i++) {
	        rule = rules[i];
	        valid = Validation.validate(value, rule, this, options);
	        valid = rule.not ? !valid : valid;
	        if (!valid) {
	          break;
	        }
	      }

	      // 当前规则
	      this.current = rule;
	      this.valid = valid;

	      options.noAdvice || this.advice[valid ? 'success' : 'error'](rule);

	      this.emit('validate', {
	        valid: valid,
	        rule: rule,
	        from: options.from
	      });

	      return valid;
	    }
	  }]);

	  return Validation;
	}(_events2.default);
	//~ Validation


	/**
	 * 提示方式集合，可扩展
	 */


	Validation.Advice = {};

	/**
	 * 处理方式集合，可扩展
	 */
	Validation.Handler = {};

	/**
	 * 验证器集合，可扩展
	 */
	Validation.Validator = _Validator2.default;

	exports.default = Validation;

	/*
	 * 创建和包装提示器
	 */

	function createAdvice(self, name) {
	  var Advice = Validation.Advice[name];
	  if (!Advice) {
	    throw new Error('invalid advice: ' + name);
	  }

	  var advice = new Advice(self, self.options);

	  return {
	    prompt: function prompt() {
	      var rule = self.current || self.rules[0];
	      if (advice.prompt) {
	        advice.prompt(self, getMessage(self, rule.prompt));
	      }
	    },

	    success: function success(rule) {
	      if (advice.success) {
	        advice.success(self, getMessage(self, rule.success));
	      }
	    },

	    error: function error(rule) {
	      if (advice.error) {
	        var message = self.errorMessage !== null ? // 验证前会被设置为null，不以空判断是因为使用方有可能会设置为''
	        self.errorMessage : rule.error || rule.message;
	        advice.error(self, getMessage(self, message));
	      }
	    }
	  };
	}

	function getMessage(o, message) {
	  if (o.messages) {
	    var code = message;
	    message = o.messages[code] || code;
	  }
	  return message;
	}

	/**
	 * 默认处理器
	 */
	Validation.Handler['default'] = function () {
	  // eslint-disable-line
	  var self = this;
	  var elm = (0, _dom2.default)(this.elm);
	  var dataField = 'validationAdvicePrompt';

	  var timer = null;
	  var validate = function validate() {
	    // debounce
	    if (timer) {
	      return;
	    }
	    timer = setTimeout(function () {
	      timer = null;
	    }, 100);
	    elm.removeData(dataField);
	    self.validate({ from: 'event' });
	  };

	  var advice = this.advice;

	  handleInstant(self, elm);

	  elm.on('keydown', function () {
	    if (!elm.data(dataField)) {
	      advice.prompt();
	      elm.data(dataField, true);
	    }
	  });

	  elm.on('change', validate);

	  if (is(elm, 'input', 'radio') || is(elm, 'input', 'checkbox')) {
	    elm.on('click', validate);
	  } else if (is(elm, 'input') || is(elm, 'textarea')) {
	    elm.on('blur', validate);
	  }
	};

	function is(elm, tag, type) {
	  elm = elm.get();
	  if (elm.tagName.toLowerCase() !== tag) {
	    return false;
	  }
	  return type ? elm.type === type : true;
	}

	/*
	 * 如果规则配置了`instant`，则输入变化时都会进行校验
	 */
	function handleInstant(self, elm) {
	  var rules = self.rules.filter(function (rule) {
	    return rule.instant;
	  });

	  if (!rules.length) {
	    return;
	  }

	  elm.data('validationValue', elm.val());
	  var handler = function handler() {
	    var last = elm.data('validationValue');
	    var value = elm.val();
	    if (last === value) {
	      return;
	    }

	    if (self.validate({ rules: rules })) {
	      elm.data('validationValue', value);
	    } else if (self.current.invert) {
	      value && setTimeout(function () {
	        elm.val(last);
	      }, 50);
	    }
	  };

	  elm.on('input', handler);
	  elm.on('keypress', handler);
	  elm.on('keyup', handler);
	}

	/**
	 * 默认提示器，采用FormAlert方式提示
	 */
	Validation.Advice.default = _AssistAdvice2.default;

	/**
	 * 采用alert方法提示错误
	 */

	var AlertAdvice = function () {
	  function AlertAdvice() {
	    _classCallCheck(this, AlertAdvice);
	  }

	  _createClass(AlertAdvice, [{
	    key: 'error',
	    value: function error(message) {
	      alert(message); // eslint-disable-line
	    }
	  }]);

	  return AlertAdvice;
	}();

	Validation.Advice.alert = AlertAdvice;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function (n) {
	  if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function (type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events) this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler)) return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++) {
	      listeners[i].apply(this, args);
	    }
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function (type, listener) {
	  var m;

	  if (!isFunction(listener)) throw TypeError('listener must be a function');

	  if (!this._events) this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener) this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function (type, listener) {
	  if (!isFunction(listener)) throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function (type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener)) throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type]) return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener || isFunction(list.listener) && list.listener === listener) {
	    delete this._events[type];
	    if (this._events.removeListener) this.emit('removeListener', type, listener);
	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener || list[i].listener && list[i].listener === listener) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0) return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener) this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function (type) {
	  var key, listeners;

	  if (!this._events) return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0) this._events = {};else if (this._events[type]) delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length) {
	      this.removeListener(type, listeners[listeners.length - 1]);
	    }
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function (type) {
	  var ret;
	  if (!this._events || !this._events[type]) ret = [];else if (isFunction(this._events[type])) ret = [this._events[type]];else ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function (type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener)) return 1;else if (evlistener) return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function (emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*
	 * 因为validation库不依赖其他类库
	 * 所以需要包装一个简单的jquery api兼容的工具类
	 * 后续有必要也可以方便切换
	 */
	var Dom = function () {
	  function Dom(elm) {
	    _classCallCheck(this, Dom);

	    this.elm = elm;
	  }

	  _createClass(Dom, [{
	    key: 'get',
	    value: function get() {
	      return this.elm;
	    }
	  }, {
	    key: 'on',
	    value: function on(name, fn) {
	      this.elm.addEventListener(name, fn, false);
	    }
	  }, {
	    key: 'hasClass',
	    value: function hasClass(name) {
	      var re = new RegExp('(^|\\s)' + name + '(\\s|$)');
	      return re.test(this.elm.className);
	    }
	  }, {
	    key: 'addClass',
	    value: function addClass(names) {
	      setClass(this.elm, names, function (list, name) {
	        if (list.indexOf(name) === -1) {
	          list.push(name);
	        }
	        return list;
	      });
	    }
	  }, {
	    key: 'removeClass',
	    value: function removeClass(names) {
	      setClass(this.elm, names, function (list, name) {
	        var index = list.indexOf(name);
	        if (index !== -1) {
	          list.splice(index, 1);
	        }
	        return list;
	      });
	    }
	  }, {
	    key: 'val',
	    value: function val(value) {
	      var elm = this.elm;

	      if (value === undefined) {
	        return elm.value;
	      }
	      elm.value = value;
	    }
	  }, {
	    key: 'data',
	    value: function data(name, value) {
	      var elm = this.elm;

	      if (value !== undefined) {
	        elm.dataset[name] = JSON.stringify(value);
	      }

	      var json = elm.dataset[name];
	      if (json) {
	        try {
	          return JSON.parse(json);
	        } catch (e) {
	          console.error('invalid json: ' + json); // eslint-disable-line
	        }
	      }
	      return undefined;
	    }
	  }, {
	    key: 'removeData',
	    value: function removeData(name) {
	      delete this.elm.dataset[name];
	    }
	  }]);

	  return Dom;
	}();

	function setClass(elm, names, reducer) {
	  names = split(names);
	  if (!names.length) {
	    return;
	  }

	  var list = split(elm.className);
	  elm.className = names.reduce(reducer, list).join(' ');
	}

	function split(str) {
	  str = str.trim();
	  return str ? str.split(/\s+/g) : [];
	}

	var _exports = window.jQuery || window.Zepto || function (elm) {
	  return new Dom(elm);
	};

	exports.default = _exports;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _dom = __webpack_require__(3);

	var _dom2 = _interopRequireDefault(_dom);

	var _Messages = __webpack_require__(5);

	var _Messages2 = _interopRequireDefault(_Messages);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * 内置验证器
	 */

	/*
	 * 正则表达式
	 *
	 * 一般用于html中以`data-validate`方式指定，如果在js中直接使用正则式语法。
	 *
	 * {
	 *  type: 'regexp',
	 *  pattern: '^\\d+$'
	 * }
	 */
	exports.regexp = function (v, options) {
	  return new RegExp(options.pattern).test(v);
	};

	/*
	 * 长度校验
	 *
	 * {
	 *  type: 'length',
	 *  length: 8, // 也可以使用`minLength`和`maxLength`指定区间
	 *  minLength: 1,
	 *  maxLength: 10
	 * }
	 */
	exports.length = function (v, options) {
	  if (options.length) {
	    return v.length === options.length;
	  }

	  var min = options.minLength !== undefined ? options.minLength : Number.MIN_VALUE;
	  var max = options.maxLength !== undefined ? options.maxLength : Number.MAX_VALUE;
	  return min <= v.length && v.length <= max;
	};

	/*
	 * 数字在区域范围内
	 *
	 * {
	 *  type: 'range',
	 *  min: 1.1,
	 *  max: 10000
	 * }
	 */
	exports.range = function (v, options) {
	  return range(v, options, /^\d+(\.\d+)?$/);
	};

	/*
	 * 整数在区域范围内
	 *
	 * {
	 *  type: 'intRange',
	 *  min: 1,
	 *  max: 1000
	 * }
	 */
	exports.intRange = function (v, options) {
	  return range(v, options, /^\d+$/);
	};

	/*
	 * Email
	 */
	var rEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
	exports.email = function (v) {
	  return rEmail.test(v);
	};

	/*
	 * 数组元素数量
	 *
	 * {
	 *  type: 'array',
	 *  length: 10,         // 数组大小
	 *  ignoreEmpty: true,  // 是否忽略空白项
	 *
	 *  // 也可以指定一区间
	 *  minLength: 1,       // 最小数组元素
	 *  maxLength: 10       // 数组元素
	 * }
	 */
	exports.array = function (v, options) {
	  if (!Array.isArray(v)) {
	    return false;
	  }

	  var len = options.ignoreEmpty ? lengthIgnoreEmpty(v) : v.length;

	  if (options.length) {
	    return len === options.length;
	  }

	  var min = options.minLength !== undefined ? options.minLength : Number.MIN_VALUE;
	  var max = options.maxLength !== undefined ? options.maxLength : Number.MAX_VALUE;
	  return min <= len && len <= max;
	};

	function lengthIgnoreEmpty(list) {
	  var len = 0;
	  for (var i = 0, c = list.length; i < c; i++) {
	    isEmpty(list[i]) || len++;
	  }
	  return len;
	}

	function isEmpty(v) {
	  return !v || typeof v === 'string' && /^\s*$/.test(v);
	}

	function range(v, options, pattern) {
	  if (!pattern.test(v)) {
	    return false;
	  }

	  options = options || [];
	  var min = options.min !== undefined ? options.min : Number.MIN_VALUE;
	  var max = options.max !== undefined ? options.max : Number.MAX_VALUE;
	  v = parseFloat(v);
	  return min <= v && v <= max;
	}

	/*
	 * async验证
	 */
	exports.async = function (value, rule, options) {
	  var elm = (0, _dom2.default)(this.elm);

	  // 上一次的值
	  var last = elm.data('validationLastValue');
	  // 数据没变化，则返回上一次验证结果
	  if (last === value) {
	    var result = elm.data('validationResult') || {};
	    this.errorMessage = result.errorMessage;
	    return result.valid;
	  }

	  // 走异步验证
	  asyncValidate(this, value, rule, options);
	  this.errorMessage = ''; // 不显示出错信息，等待异步验证结果
	  // 如果从来没异步验证过，则让其通过(直接点击submit事件)
	  // 如果表单域触发的，就让其暂时验证通过
	  // 其他情况，让其验证不通过(比如submit)
	  return last === undefined || options.from === 'event';
	};

	function asyncValidate(self, value, rule, options) {
	  var validate = rule.validate;
	  if (!validate) {
	    throw new Error('rule.validate required');
	  }

	  var defer = validate.call(self, value, rule);
	  if (!defer || typeof defer.then !== 'function') {
	    throw new Error('async validate should return a promise object');
	  }

	  var flag = false;
	  function done(o) {
	    // 只允许执行一次done
	    if (flag) {
	      return;
	    }
	    flag = true;

	    var elm = (0, _dom2.default)(self.elm);

	    elm.data('validationResult', o);
	    elm.data('validationLastValue', value);

	    if (!options.noAdvice) {
	      self.errorMessage = o.errorMessage;
	      self.advice[o.valid ? 'success' : 'error'](rule);
	    }
	  }

	  // 超时
	  setTimeout(function () {
	    done({ valid: false, errorMessage: _Messages2.default.Timeout });
	  }, 5000);

	  defer.then(function (o) {
	    o = o || {};
	    done({ valid: o.valid, errorMessage: o.errorMessage });
	  }, function () {
	    done({ valid: false, errorMessage: _Messages2.default.NetworkError });
	  });
	}
	//~ async


	exports.default = exports;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  Timeout: 'timeout',
	  NetworkError: 'network error'
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _dom = __webpack_require__(3);

	var _dom2 = _interopRequireDefault(_dom);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var AssistAdvice = function () {
	  function AssistAdvice(vo, options) {
	    _classCallCheck(this, AssistAdvice);

	    this.elm = vo.elm;

	    this.options = Object.assign({
	      fieldClassNames: {
	        prompt: 'validation-prompt',
	        success: 'validation-success',
	        error: 'validation-error'
	      },

	      assistClassNames: {
	        prompt: 'validation-assist-prompt',
	        success: 'validation-assist-success',
	        error: 'validation-assist-error'
	      },

	      getAssist: getAssist
	    }, options);
	  }

	  _createClass(AssistAdvice, [{
	    key: 'prompt',
	    value: function prompt(o, message) {
	      this.show(o.elm, message, 'prompt');
	    }
	  }, {
	    key: 'success',
	    value: function success(o, message) {
	      this.show(o.elm, message, 'success');
	    }
	  }, {
	    key: 'error',
	    value: function error(o, message) {
	      this.show(o.elm, message, 'error');
	    }
	  }, {
	    key: 'show',
	    value: function show(elm, message, type) {
	      type = type || 'error';
	      var options = this.options;

	      var assist = options.getAssist(elm) || createAssist(elm);
	      var $assist = (0, _dom2.default)(assist);
	      var $elm = (0, _dom2.default)(elm);

	      var fieldCns = options.fieldClassNames;
	      var assistCns = options.assistClassNames;

	      removeClass($elm, fieldCns);
	      removeClass($assist, assistCns);

	      fieldCns[type] && $elm.addClass(fieldCns[type]);
	      assistCns[type] && $assist.addClass(assistCns[type]);

	      if (message) {
	        assist.innerHTML = message;
	        assist.style = 'display: ;';
	      } else {
	        assist.innerHTML = '';
	        assist.style = 'display: none;';
	      }
	    }
	  }]);

	  return AssistAdvice;
	}();
	//~ AssistAdvice


	function getAssist(elm) {
	  var assist = elm.nextSibling;
	  while (assist) {
	    if (assist.nodeType === 1 && (0, _dom2.default)(assist).hasClass('validation-assist')) {
	      return assist;
	    }
	    assist = assist.nextSibling;
	  }
	  return null;
	}

	function createAssist(elm) {
	  var assist = document.createElement('div');
	  (0, _dom2.default)(assist).addClass('validation-assist');
	  var next = elm.nextSibling;
	  if (next) {
	    elm.parentNode.insertBefore(assist, next);
	  } else {
	    elm.parentNode.appendChild(assist);
	  }
	  return assist;
	}

	function removeClass(elm, map) {
	  elm.removeClass((map.prompt || '') + ' ' + (map.success || '') + ' ' + (map.error || ''));
	}

	exports.default = AssistAdvice;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _dom = __webpack_require__(3);

	var _dom2 = _interopRequireDefault(_dom);

	var _Validation = __webpack_require__(1);

	var _Validation2 = _interopRequireDefault(_Validation);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var FormValidation = function () {

	  /**
	   * 表单验证
	   * @param {jQuery} form    - 表单
	   * @param {Object} options - 额外的参数
	   *  - validateOnSubmit {Boolean} 默认表单submit时会验证，如果设置此属性为false，则不会处理submit事件
	   */
	  function FormValidation(form, options) {
	    _classCallCheck(this, FormValidation);

	    this.form = form;
	    this.options = options || {};

	    this.refresh();

	    if (this.options.validateOnSubmit !== false && form.tagName.toLowerCase() === 'form') {
	      handleForm(this);
	    }
	  }

	  /**
	   * 校验表单
	   *
	   * @param {Object} options - 配置参数
	   *  - fields {Array}  允许只对指定表单域进行校验
	   *
	   * @return {Boolean}       - 校验结果
	   */


	  _createClass(FormValidation, [{
	    key: 'validate',
	    value: function validate(options) {
	      options = options || {};

	      var vs = options.fields ? options.fields.reduce(function (list, elm) {
	        var v = elm.data('validation');
	        v && list.push(v);
	        return list;
	      }, []) : this.validations;

	      var valid = true;
	      var flag = false;
	      for (var i = 0, c = vs.length; i < c; i++) {
	        var v = vs[i];
	        if (!v.validate(options)) {
	          valid = false;
	          if (!flag) {
	            focus(v.elm);
	            flag = true;
	          }
	        }
	      }

	      adviceForm(this, valid);

	      return valid;
	    }

	    /**
	     * 有时候当表单发生变化时（重绘时
	     * 需要refresh重新初始化验证器
	     */

	  }, {
	    key: 'refresh',
	    value: function refresh() {
	      var _this = this;

	      var form = this.form;
	      var options = this.options;

	      var inputs = form.querySelectorAll('input,select,textarea');

	      this.validations = Array.from(inputs).reduce(function (list, input) {
	        input = (0, _dom2.default)(input);
	        var v = input.data('validation');
	        if (!v) {
	          var rules = input.data('validate');
	          if (rules) {
	            var opts = Object.assign({}, options);
	            opts.rules = rules;
	            v = new _Validation2.default(input.get(), opts);
	            v.on('validate', function (event) {
	              if (event.from === 'event') {
	                tryAdviceForm(_this);
	              }
	            });
	            input.data('validation', v);
	          }
	        }
	        v && list.push(v);
	        return list;
	      }, []);
	    }
	  }]);

	  return FormValidation;
	}();
	//~ FormValidation


	function handleForm(self) {
	  (0, _dom2.default)(self.form).on('submit', function (e) {
	    if (!self.validate()) {
	      e.preventDefault();
	    }
	  });
	}

	function focus(elm) {
	  try {
	    elm.focus && elm.focus();
	  } catch (e) {
	    console.error(e); // eslint-disable-line
	  }
	}

	function adviceForm(self, valid) {
	  var cns = self.options.formClassNames || {
	    error: 'validation-form-error',
	    success: 'validation-form-success'
	  };

	  var form = (0, _dom2.default)(self.form);
	  form.removeClass((cns.error || '') + ' ' + (cns.success || ''));
	  var cn = cns[valid ? 'success' : 'error'];
	  cn && form.addClass(cn);
	}

	function tryAdviceForm(self) {
	  var vs = this.validations;
	  var error = vs.some(function (v) {
	    return v.valid === false;
	  });
	  if (error) {
	    adviceForm(self, false);
	    return;
	  }

	  var success = vs.some(function (v) {
	    return v.valid === true;
	  });
	  if (success) {
	    adviceForm(self, true);
	  }
	}

	exports.default = FormValidation;

/***/ }
/******/ ])
});
;
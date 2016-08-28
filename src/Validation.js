/**
 * 表单验证组件
 */

import Validator from './Validator';
import Alert     from './Alert';

import {
  hasClass,
  getValue,
  setValue,
  getData,
  setData,
  removeData
} from './util';


/* eslint complexity: [2, 11], no-alert: 0 */


class Validation {

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
  static validate(value, rule, o, options) {
    // validate is for regexp or function
    const type = rule.type || rule.validate;
    if (!type) {
      throw new Error('validate rule required');
    }

    // required
    if (type === 'required') {
      return !!value;
    }

    // empty value return true for default
    if (!value && !rule.force) {
      return true;
    }

    let v = type;
    if (typeof type === 'string') {
      v = Validation.Validator[type];
      if (!v) {
        throw new Error('invalid validator: ' + type);
      }
    }

    return typeof v === 'function' ? v.call(o, value, rule, options) :
        typeof v.test === 'function' ? v.test(value) : true;
  }


  /**
   * 构造一个验证器用于验证一个表单控件
   *
   * @param {Element} elm   - 表单元素
   * @param {Array} options - 验证配置
   *  {
   *  advice: {String}  - 出错提示方式，默认为'default'
   *  handler: {String} - 处理方式，默认为'default'
   *  rules:  - 验证规则
   *  [
   *    {
   *      type: {String}    - 验证器名称
   *      param: {String|Array|Object} - 验证器参数，如果没有, rule将作为参数
   *      message|error: {String} - 出错信息
   *      prompt: {String}        - 提示信息
   *      success: {String}       - 验证成功信息
   *      force: {Boolean}        - 为空时是否强制校验
   *      not: {Boolean}          - 反向
   *    }
   *  ]
   *  }
   */
  constructor(elm, options) {
    if (!elm || elm.nodeType !== 1) {
      throw new Error('invalid element for validation');
    }

    options = options || {};

    // 当前元素
    this.elm = elm;

    // 允许仅仅指定rules
    this.options = options.rules ? options : { rules: options };

    const { rules = [] } = this.options;

    // 验证规则
    this.rules = Array.isArray(rules) ? rules : [rules];

    // advice用于处理提示信息
    this.advice = createAdvice(this, options.advice || 'default');

    // handler用于挂接表单元素事件
    this.handler = Validation.Handler[options.handler || 'default'];

    // 挂接验证事件
    this.handler.call(this, this);

    // 提示信息映射表
    this.messages = options.messages;

    // 是否开启
    this.enabled = true;
  }


  /**
   * 开启验证
   */
  enable() {
    this.enabled = true;
  }


  /**
   * 关闭验证
   */
  disable() {
    this.enabled = false;
    this.advice.prompt();
  }


  /**
   * 验证表单元素
   *
   * @param {Object} options   -  配置项
   *  noAdvice {Boolean}  - 仅验证不进行提示
   *  from {String}       - 验证来源
   * @return {Boolean}         - 验证结果
   */
  validate(options) {
    options = options || {};

    const elm = this.elm;
    // 如果验证器关闭，或者表单元素`disabled`忽略此验证
    if (!this.enabled || elm.disabled || hasClass(elm, 'disabled')) {
      return true;
    }

    const value = getValue(elm);
    const rules = options.rules || this.rules;

    let valid = true;
    let rule = null;

    this.current = null;    // current rule
    this.errorMessage = null;

    for (let i = 0, c = rules.length; i < c; i++) {
      rule = rules[i];
      valid = Validation.validate(value, rule, this, options);
      valid = rule.not ? !valid : valid;
      if (!valid) {
        break;
      }
    }

    // 当前规则
    this.current = rule;

    options.noAdvice || this.advice[valid ? 'success' : 'error'](rule);

    /*
    trigger('validate', {
      valid: valid,
      rule: rule
    });
    */

    return valid;
  }
}


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
Validation.Validator = Validator;


module.exports = Validation;
//~


/*
 * 创建和包装提示器
 */
function createAdvice(self, name) {
  const advice = Validation.Advice[name];
  if (!advice) {
    throw new Error('invalid advice: ' + name);
  }

  return {
    prompt: function() {
      const rule = self.current || self.rules[0];
      advice.prompt && advice.prompt(self, rule);
    },

    success: function(rule) {
      advice.success && advice.success(self, rule);
    },

    error: function(rule) {
      advice.error && advice.error(self, rule);
    }
  };
}


/**
 * 默认处理器
 */
Validation.Handler['default'] = function() {    // eslint-disable-line
  const self = this;
  const elm = this.elm;
  const dataField = 'validation-advice-prompt';

  let timer = null;
  const validate = function() {
    // debounce
    if (timer) {
      return;
    }
    timer = setTimeout(function() {
      timer = null;
    }, 100);
    removeData(elm, dataField);
    self.validate({ from: 'event' });
  };
  const advice = this.advice;

  handleInstant(self, elm);

  elm.addEventListener('keydown', function() {
    if (!getData(elm, dataField)) {
      advice.prompt();
      setData(elm, true);
    }
  }, false);

  elm.addEventListener('change', validate, false);

  if (is(elm, 'input', 'text') ||
      is(elm, 'textarea')) {
    elm.addEventListener('blur', validate, false);
  } else if (is(elm, 'input', 'radio') ||
      is('input', 'checkbox')) {
    elm.addEventListener('click', validate, false);
  }
};


function is(elm, tag, type) {
  if (elm.tagName.toLowerCase() !== tag) {
    return false;
  }

  return type ? elm.type === type : true;
}


function handleInstant(self, elm) {
  const rules = self.rules.filter(function(rule) {
    return rule.instant;
  });

  if (!rules.length) {
    return;
  }

  setData(elm, 'validationValue', getValue(elm));
  const handler = function() {
    const last = getData(elm, 'validationValue');
    const value = getValue(elm);
    if (last === value) {
      return;
    }

    if (self.validate({ rules: rules })) {
      setData(elm, 'validationValue', value);
    } else if (self.current.invert) {
      value && setTimeout(function() {
        setValue(elm, last);
      }, 50);
    }
  };

  elm.addEventListener('input', handler, false);
  elm.addEventListener('keypress', handler, false);
  elm.addEventListener('keyup', handler, false);
}


/**
 * 默认提示器，采用FormAlert方式提示
 */
Validation.Advice['default'] = {    // eslint-disable-line
  prompt: function(o, rule) {
    Alert.info(o.elm, getMessage(o, rule.prompt));
  },

  success: function(o, rule) {
    Alert.success(o.elm, getMessage(o, rule.success));
  },

  error: function(o, rule) {
    const message = o.errorMessage !== null ?  // 验证前会被设置为null，不以空判断是因为使用方有可能会设置为''
        o.errorMessage : (rule.error || rule.message);
    Alert.error(o.elm, getMessage(o, message));
  }
};


function getMessage(o, message) {
  if (o.messages) {
    const code = message;
    message = o.messages[code] || code;
  }
  return message;
}


/**
 * 采用alert方法提示错误
 */
Validation.Advice.alert = {
  error: function(elm, rule) {
    alert(rule.error || rule.message);
  }
};


/*
 * async验证
 */
Validator.async = function(value, rule, options) {
  const elm = this.elm;

  // 上一次的值
  const last = getData(elm, 'validationLastValue');
  // 数据没变化，则返回上一次验证结果
  if (last === value) {
    const result = getData(elm, 'validationResult') || {};
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
  const validate = rule.validate;
  if (!validate) {
    throw new Error('rule.validate required');
  }

  const defer = validate.call(self, value, rule);
  if (!defer || typeof defer.then !== 'function') {
    throw new Error('async validate should return a promise object');
  }

  let flag = false;
  function done(o) {
    // 只允许执行一次done
    if (flag) {
      return;
    }
    flag = true;

    setData(self.elm, 'validationResult', o);
    setData(self.elm, 'validationLastValue', value);

    if (!options.noAdvice) {
      self.errorMessage = o.errorMessage;
      self.advice[o.valid ? 'success' : 'error'](rule);
    }
  }

  // 超时
  setTimeout(function() {
    done({ valid: false, errorMessage: Validation.Messages.Timeout });
  }, 5000);

  defer.then(function(o) {
    o = o || {};
    done({ valid: o.valid, errorMessage: o.errorMessage });
  }, function() {
    done({ valid: false, errorMessage: Validation.Messages.NetworkError });
  });
}


/**
 * 用于自定义message
 */
Validation.Messages = {
  Timeout: 'timeout',
  NetworkError: 'network error'
};


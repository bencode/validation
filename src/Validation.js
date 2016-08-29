/**
 * 表单验证组件
 */

import EventEmitter from 'events';
import $            from './dom';
import Validator    from './Validator';
import AssistAdvice from './AssistAdvice';


class Validation extends EventEmitter {

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
  constructor(elm, options) {
    super();

    if (!elm || elm.nodeType !== 1) {
      throw new Error('invalid element for validation, it should be a dom element.');
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
   *
   * @return {Boolean}         - 验证结果
   */
  /* eslint complexity: [2, 12], max-statements: [2, 22] */
  validate(options) {
    options = options || {};

    const elm = $(this.elm);
    // 如果验证器关闭，或者表单元素`disabled`忽略此验证
    if (!this.enabled || elm.get().disabled || elm.hasClass('disabled')) {
      return true;
    }

    let value = elm.val();
    value = typeof value === 'string' ? value.trim() : value;

    // 允许调用时使用自定义rules进行校验
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
    this.valid = valid;

    options.noAdvice || this.advice[valid ? 'success' : 'error'](rule);

    this.emit('validate', {
      valid: valid,
      rule: rule,
      from: options.from
    });

    return valid;
  }
}
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
Validation.Validator = Validator;


export default Validation;


/*
 * 创建和包装提示器
 */
function createAdvice(self, name) {
  const Advice = Validation.Advice[name];
  if (!Advice) {
    throw new Error('invalid advice: ' + name);
  }

  const advice = new Advice(self, self.options);

  return {
    prompt: function() {
      const rule = self.current || self.rules[0];
      if (advice.prompt) {
        advice.prompt(self, getMessage(self, rule.prompt));
      }
    },

    success: function(rule) {
      if (advice.success) {
        advice.success(self, getMessage(self, rule.success));
      }
    },

    error: function(rule) {
      if (advice.error) {
        const message = self.errorMessage !== null ?  // 验证前会被设置为null，不以空判断是因为使用方有可能会设置为''
            self.errorMessage : (rule.error || rule.message);
        advice.error(self, getMessage(self, message));
      }
    }
  };
}


function getMessage(o, message) {
  if (o.messages) {
    const code = message;
    message = o.messages[code] || code;
  }
  return message;
}



/**
 * 默认处理器
 */
Validation.Handler['default'] = function() {    // eslint-disable-line
  const self = this;
  const elm = $(this.elm);
  const dataField = 'validationAdvicePrompt';

  let timer = null;
  const validate = function() {
    // debounce
    if (timer) {
      return;
    }
    timer = setTimeout(function() {
      timer = null;
    }, 100);
    elm.removeData(dataField);
    self.validate({ from: 'event' });
  };

  const advice = this.advice;

  handleInstant(self, elm);

  elm.on('keydown', function() {
    if (!elm.data(dataField)) {
      advice.prompt();
      elm.data(dataField, true);
    }
  });

  elm.on('change', validate);

  if (is(elm, 'input', 'radio') ||
      is(elm, 'input', 'checkbox')) {
    elm.on('click', validate);
  } else if (
      is(elm, 'input') ||
      is(elm, 'textarea')) {
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
  const rules = self.rules.filter(function(rule) {
    return rule.instant;
  });

  if (!rules.length) {
    return;
  }

  elm.data('validationValue', elm.val());
  const handler = function() {
    const last = elm.data('validationValue');
    const value = elm.val();
    if (last === value) {
      return;
    }

    if (self.validate({ rules: rules })) {
      elm.data('validationValue', value);
    } else if (self.current.invert) {
      value && setTimeout(function() {
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
Validation.Advice.default = AssistAdvice;


/**
 * 采用alert方法提示错误
 */
class AlertAdvice {
  error(message) {
    alert(message); // eslint-disable-line
  }
}

Validation.Advice.alert = AlertAdvice;

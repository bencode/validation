import $ from './dom';
import Messages from './Messages';


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
exports.regexp = function(v, options) {
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
exports.length = function(v, options) {
  if (options.length) {
    return v.length === options.length;
  }

  const min = options.minLength !== undefined ?
      options.minLength : Number.MIN_VALUE;
  const max = options.maxLength !== undefined ?
      options.maxLength : Number.MAX_VALUE;
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
exports.range = function(v, options) {
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
exports.intRange = function(v, options) {
  return range(v, options, /^\d+$/);
};


/*
 * Email
 */
const rEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
exports.email = function(v) {
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
exports.array = function(v, options) {
  if (!Array.isArray(v)) {
    return false;
  }

  const len = options.ignoreEmpty ? lengthIgnoreEmpty(v) : v.length;

  if (options.length) {
    return len === options.length;
  }

  const min = options.minLength !== undefined ?
      options.minLength : Number.MIN_VALUE;
  const max = options.maxLength !== undefined ?
      options.maxLength : Number.MAX_VALUE;
  return min <= len && len <= max;
};


function lengthIgnoreEmpty(list) {
  let len = 0;
  for (let i = 0, c = list.length; i < c; i++) {
    isEmpty(list[i]) || (len++);
  }
  return len;
}


function isEmpty(v) {
  return !v || (typeof v === 'string') && (/^\s*$/).test(v);
}


function range(v, options, pattern) {
  if (!pattern.test(v)) {
    return false;
  }

  options = options || [];
  const min = options.min !== undefined ? options.min : Number.MIN_VALUE;
  const max = options.max !== undefined ? options.max : Number.MAX_VALUE;
  v = parseFloat(v);
  return min <= v && v <= max;
}



/*
 * async验证
 */
exports.async = function(value, rule, options) {
  const elm = $(this.elm);

  // 上一次的值
  const last = elm.data('validationLastValue');
  // 数据没变化，则返回上一次验证结果
  if (last === value) {
    const result = elm.data('validationResult') || {};
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

    const elm = $(self.elm);

    elm.data('validationResult', o);
    elm.data('validationLastValue', value);

    if (!options.noAdvice) {
      self.errorMessage = o.errorMessage;
      self.advice[o.valid ? 'success' : 'error'](rule);
    }
  }

  // 超时
  setTimeout(function() {
    done({ valid: false, errorMessage: Messages.Timeout });
  }, 5000);

  defer.then(function(o) {
    o = o || {};
    done({ valid: o.valid, errorMessage: o.errorMessage });
  }, function() {
    done({ valid: false, errorMessage: Messages.NetworkError });
  });
}
//~ async


export default exports;

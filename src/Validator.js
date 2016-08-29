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


export default exports;

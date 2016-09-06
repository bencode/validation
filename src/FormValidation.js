import $  from './dom';
import Validation from './Validation';


class FormValidation {

  /**
   * 表单验证
   * @param {jQuery} form    - 表单
   * @param {Object} options - 额外的参数
   *  - validateOnSubmit {Boolean} 默认表单submit时会验证，如果设置此属性为false，则不会处理submit事件
   */
  constructor(form, options) {
    this.form = form;
    this.options = options || {};

    this.refresh();

    if (this.options.validateOnSubmit !== false &&
        form.tagName.toLowerCase() === 'form') {
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
  validate(options) {
    options = options || {};

    const vs = options.fields ?
      options.fields.reduce((list, elm) => {
        const v = (elm.data('validation'));
        v && list.push(v);
        return list;
      }, []) :
      this.validations;

    let valid = true;
    let flag = false;
    for (let i = 0, c = vs.length; i < c; i++) {
      const v = vs[i];
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
  refresh() {
    const form = this.form;
    const options = this.options;

    const inputs = form.querySelectorAll('input,select,textarea');

    this.validations = Array.from(inputs).reduce((list, input) => {
      input = $(input);
      let v = input.data('validation');
      if (!v) {
        const rules = input.data('validate');
        if (rules) {
          const opts = Object.assign({}, options);
          opts.rules = rules;
          v = new Validation(input[0], opts);
          v.on('validate', event => {
            if (event.from === 'event') {
              tryAdviceForm(this);
            }
          });
          input.data('validation', v);
        }
      }
      v && list.push(v);
      return list;
    }, []);
  }
}
//~ FormValidation


function handleForm(self) {
  $(self.form).on('submit', function(e) {
    if (!self.validate()) {
      e.preventDefault();
    }
  });
}


function focus(elm) {
  try {
    elm.focus && elm.focus();
  } catch (e) {
    console.error(e);   // eslint-disable-line
  }
}


function adviceForm(self, valid) {
  const cns = self.options.formClassNames || {
    error: 'validation-form-error',
    success: 'validation-form-success'
  };

  const form = $(self.form);
  form.removeClass(`${cns.error || ''} ${cns.success || ''}`);
  const cn = cns[valid ? 'success' : 'error'];
  cn && form.addClass(cn);
}


function tryAdviceForm(self) {
  const vs = self.validations;
  const error = vs.some(v => v.valid === false);
  if (error) {
    adviceForm(self, false);
    return;
  }

  const success = vs.every(v => v.valid === true);
  if (success) {
    adviceForm(self, true);
  }
}


export default FormValidation;


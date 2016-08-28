import Validation from './Validation';
import $  from './dom';


class FormValidation {

  /**
   * 表单验证
   * @param {jQuery} form - 表单
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

    //handleRefresh(this);
  }


  validate(options) {
    options = options || {};

    let vs = this.validations;
    if (options.fields) {
      vs = [];
      options.fields.forEach(elm => {
        const v = $(elm).data('validation');
        v && vs.push(v);
      });
    }

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
    return valid;
  }


  refresh() {
    const form = this.form;
    const options = this.options;

    const inputs = Array.from(form.elements).filter(input => {
      return $(input).data('validate');
    });

    const vs = [];
    inputs.forEach(input => {
      input = $(input);
      let v = input.data('validation');
      if (!v) {
        const opts = Object.assign({}, options, input.data('validate'));
        v = new Validation(input.get(), opts);
        input.data('validation', v);
      }
      vs.push(v);
    });

    this.validations = vs;
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


/*
function handleRefresh(self) {
  $(self.form).on('validation-refresh', function() {
    self.refresh();
  });
}
*/


function focus(elm) {
  try {
    elm.focus && elm.focus();
  } catch (e) {
    console.error(e);   // eslint-disable-line
  }
}

export default FormValidation;


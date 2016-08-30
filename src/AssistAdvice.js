import $ from './dom';


class AssistAdvice {
  constructor(vo, options) {
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


  prompt(o, message) {
    this.show(o.elm, message, 'prompt');
  }


  success(o, message) {
    this.show(o.elm, message, 'success');
  }


  error(o, message) {
    this.show(o.elm, message, 'error');
  }


  show(elm, message, type) {
    type = type || 'error';
    const options = this.options;

    const assistClassName = options.assistClassNames.element || 'validation-assist';
    const assist = options.getAssist(elm, assistClassName) ||
        createAssist(elm, assistClassName);
    const $assist = $(assist);
    const $elm = $(elm);

    const fieldCns = options.fieldClassNames;
    const assistCns = options.assistClassNames;

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
}
//~ AssistAdvice


function getAssist(elm, cn) {
  let assist = elm.nextSibling;
  while (assist) {
    if (assist.nodeType === 1 && hasClass(assist, cn)) {
      return assist;
    }
    assist = assist.nextSibling;
  }
  return null;
}


function hasClass(elm, cns) {
  elm = $(elm);
  cns = cns.split(/\s+/g);
  return cns.every(cn => elm.hasClass(cn));
}


function createAssist(elm, cn) {
  const assist = document.createElement('div');
  $(assist).addClass(cn);
  const next = elm.nextSibling;
  if (next) {
    elm.parentNode.insertBefore(assist, next);
  } else {
    elm.parentNode.appendChild(assist);
  }
  return assist;
}


function removeClass(elm, map) {
  elm.removeClass(`${map.prompt || ''} ${map.success || ''} ${map.error || ''}`);
}


export default AssistAdvice;

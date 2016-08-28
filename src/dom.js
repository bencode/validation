class Dom {
  constructor(elm) {
    this.elm = elm;
  }


  get() {
    return this.elm;
  }


  on(name, fn) {
    this.elm.addEventListener(name, fn, false);
  }


  hasClass(name) {
    const re = new RegExp('(^|\\s)' + name + '(\\s|$)');
    return re.test(this.elm.className);
  }


  val(value) {
    const { elm } = this;
    if (value === undefined) {
      return elm.value;
    }
    elm.value = value;
  }


  data(name, value) {
    const { elm } = this;
    if (value !== undefined) {
      elm.dataset[name] = JSON.stringify(value);
    }

    const json = elm.dataset[name];
    if (json) {
      try {
        return JSON.parse(json);
      } catch (e) {
        // ignore
      }
    }
    return undefined;
  }


  removeData(name) {
    delete this.elm.dataset[name];
  }
}


export default function(elm) {
  return new Dom(elm);
}

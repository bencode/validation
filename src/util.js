export function hasClass(elm, name) {
  const re = new RegExp('(^|\\s)' + name + '(\\s|$)');
  return elm.className.test(re);
}


export function getValue(elm) {
  return elm.value;
}


export function setValue(elm, value) {
  elm.value = value;
}


export function getData(elm, name) {
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


export function setData(elm, name, value) {
  elm.dataset[name] = JSON.stringify(value);
}


export function removeData(elm, name) {
  elm.dataset[name] = undefined;
}

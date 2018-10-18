
function createFilter(fn, getter, initial) {
  let _value = initial;

  if (getter) {
    return function () {
      const value = getter.apply(this, arguments);
      const valueString = JSON.stringify(value);
      if (_value === valueString) { return; }

      _value = valueString;
      fn(value);
    };
  }

  return function (value) {
    if (_value === value) { return; }

    _value = value;
    fn(value);
  };
}

module.exports = createFilter;

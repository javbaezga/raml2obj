function _isObject(obj) {
  return obj === Object(obj);
}

function makeConsistent(obj, types) {
  if (_isObject(obj)) {
    if (obj.type) {
      if (Array.isArray(obj.type)) {
        obj.type = obj.type[0];
      }

      if (types && types[obj.type]) {
        var typedef = types[obj.type];
        var objectExamples = [];
        if (obj.examples && typedef.examples) {
          objectExamples = obj.examples;
        }
        if (obj.example && typedef.example) {
          objectExamples.push(obj.example);
        }
        Object.assign(obj, types[obj.type]);
        if (objectExamples.length) {
          if (!obj.examples || !obj.examples.length) {
            obj.examples = [];
          }
          objectExamples.forEach(function(item) {
            obj.examples.push(item);
          });
        }
      }
    }

    if (obj.items && types && types[obj.items]) {
      obj.items = types[obj.items];
    }

    if (obj.examples && obj.examples.length) {
      obj.examples = obj.examples.map(example => (example.value ? example.value : example));
    }

    if (obj.structuredExample) {
      if (typeof obj.examples === 'undefined') {
        obj.examples = [];
      }

      obj.examples.push(obj.structuredExample.value);
      delete obj.example;
      delete obj.structuredExample;
    }

    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      makeConsistent(value, types);
    });
  } else if (Array.isArray(obj)) {
    obj.forEach((value) => {
      makeConsistent(value, types);
    });
  }

  return obj;
}

module.exports = makeConsistent;

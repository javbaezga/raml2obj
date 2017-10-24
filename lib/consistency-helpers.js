'use strict';

/**
 * This code is from https://github.com/raml2html/raml2obj
 */

/**
 * @license
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Kevin Renskers
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
* Uses Mulesoft's expansion library for RAML types.
*/
class ConsistencyHelper {
  /**
   * Checks if the object is type of object.
   *
   * @param {ANY} obj Object to test
   * @return {Boolean} True if the `obj` is type of Object class.
   */
  static isObject(obj) {
    return obj && obj === Object(obj) && !Array.isArray(obj);
  }

  static makeConsistent(obj, types) {
    if (!obj || obj.__typeConsistent) {
      return obj;
    }
    if (Array.isArray(obj)) {
      obj.forEach((value, i) => {
        obj[i] = ConsistencyHelper.makeConsistent(value, types);
      });
    } else if (ConsistencyHelper.isObject(obj)) {
      obj = ConsistencyHelper.consistentExample(obj);
      if (obj.type) {
        obj = ConsistencyHelper.consistentType(obj, types);
      }

      if (obj.items && types && types[obj.items]) {
        obj.items = types[obj.items];
      }

      var keys = Object.keys(obj);
      keys.forEach((key) => {
        // if (obj.__typeConsistent && ['properties', 'items'].indexOf(key) !== -1) {
        //   return;
        // }
        obj[key] = ConsistencyHelper.makeConsistent(obj[key], types);
      });
    }
    return obj;
  }

  /**
   * Makes type declaration of a property consistant.
   *
   * @param {Object} obj Currently transformed object. Probably a type
   * declaration as a `property` or `item`.
   * @param {?Array} types List of available types.
   * @return {Object} Transformed object.
   */
  static consistentType(obj, types) {
    if (Array.isArray(obj.type)) {
      obj.type = obj.type[0];
    }
    if (types && types[obj.type]) {
      ConsistencyHelper.applyType(obj, types[obj.type]);
    }

    return obj;
  }
  /**
   * Makes examples consistent by creating an array of examples with string
   * example value.
   *
   * @param {Object} obj Currently transformed object. Probably a type
   * declaration as a `property` or `item`.
   * @return {Object} Transformed object.
   */
  static consistentExample(obj) {
    if (obj.examples && obj.examples.length) {
      obj.examples = obj.examples.map(example => {
        if (example.value) {
          return example.value;
        }
        if (Array.isArray(example) || ConsistencyHelper.isObject(example)) {
          try {
            return JSON.stringify(example, null, 2);
          } catch (e) {}
        }
        return example;
      });
    }

    if (obj.structuredExample) {
      if (typeof obj.examples === 'undefined') {
        obj.examples = [];
      }
      obj.examples.push(obj.structuredExample.value);
      delete obj.example;
      delete obj.structuredExample;
    }
    return obj;
  }

  /**
   * Applies type definition to current property.
   * This adds properties from a type declaration to current object respecting
   * object's existing properties.
   *
   * For example `properties`, `items` from `obj` and `typedef` will be
   * merged and inline properties overrides types properties.
   *
   * Examples are merged into one array.
   *
   * `obj`'s inline defined properties (description, enum, default) are preserved.
   *
   * @param {Object} obj Currently transformed object. Must be type
   * declaration as a `property` or `item`.
   * @param {Object} typedef Type definition to apply to the object.
   * @return {Object} Transformed object.
   */
  static applyType(obj, typedef) {
    var overrideProperties = {
      description: obj.description,
      enum: obj.enum,
      default: obj.default,
      schema: obj.schema,
      xml: obj.xml,
      name: obj.name
      // displayName: obj.displayName // Don't do this or body will have ugly name.
    };

    var mergeProperties = {
      properties: obj.properties,
      items: obj.items
    };

    // Examples should be merged instead of being overriden.
    var examples = [];
    if (obj.examples) {
      examples = obj.examples;
      delete obj.examples;
    }
    if (obj.example) {
      examples.push(obj.example);
      delete obj.example;
    }

    obj = Object.assign(obj, typedef);

    if (obj.required === undefined) {
      obj.required = true;
    }

    if (obj.type && Array.isArray(obj.type)) {
      obj.type = obj.type[0];
    }

    if (!obj.examples) {
      obj.examples = [];
    }

    if (examples.length) {
      obj.examples = obj.examples.concat(examples);
    }

    Object.keys(mergeProperties).forEach(key => {
      if (mergeProperties[key] === undefined) {
        return;
      }
      if (!obj[key] || !obj[key].length) {
        obj[key] = [];
      }

      obj[key] = this.mergeExcludeDusplicates(mergeProperties[key], obj[key]);
    });
    if (overrideProperties.name === overrideProperties.displayName &&
      obj.displayName !== overrideProperties.displayName) {
      delete overrideProperties.displayName;
    }

    Object.keys(overrideProperties).forEach(key => {
      if (overrideProperties[key] === undefined) {
        return;
      }
      obj[key] = overrideProperties[key];
    });
    // A flag to not process this object again in case of recursive types.
    obj.__typeConsistent = true;
  }
  /**
   * Merges two array and eliminates duplicates compared by `key` property.
   *
   * @param {Array} dest Destination array. `key`s from this array have priority
   * over `source` array.
   * @param {Array} source An array to marge items with `dest`. If the `key`
   * property defined on an item of this array already exists in `dest` array
   * then this item will be omitted.
   * @return {Array} Merged both arrays. Note, that this will return an array
   * event if both arguments are undefined.
   */
  static mergeExcludeDusplicates(dest, source) {
    if (!dest || !dest.length) {
      dest = [];
    }
    if (!source || !source.length) {
      source = [];
    }
    for (let i = 0, len = source.length; i < len; i++) {
      let addItem = source[i];
      let addKey = addItem.key;
      let exists = false;
      for (let j = 0, jLen = dest.length; j < jLen; j++) {
        if (dest[j].key === addKey) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        dest.push(addItem);
      }
    }
    return dest;
  }
}

module.exports.ConsistencyHelper = ConsistencyHelper;

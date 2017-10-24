'use strict';
/* global self */
const {ConsistencyHelper} = require('./consistency-helpers');

var isNode = true;
if (typeof window !== 'undefined' || (typeof self !== 'undefined' && self.importScripts)) {
  isNode = false;
}

/* global expansion */

/**
 * Uses Mulesoft's expansion library for RAML types.
 */
class ExpansionLibrary {

  /**
   * The RAML expanded form for a RAML type, resolves references and fills
   * missing information to compute a fully expanded representation of the type.
   *
   * The canonical form computes inheritance and pushes unions to the top
   * level of the type structure of an expanded RAML type.
   *
   * More info:
   * https://github.com/raml-org/raml-parser-toolbelt/tree/master/tools/datatype-expansion
   *
   * @param {Object} types A map of RAML types
   * @return {Promise} Resolved to expanded canonical form of RAML types.
   */
  static expandRootTypes(types) {
    if (!types) {
      return Promise.resolve(types);
    }
    types = ExpansionLibrary.prepareTypes(types);
    var keys = Object.keys(types);
    if (!keys.length) {
      return Promise.resolve(types);
    }
    var result = {};
    keys.forEach(key => {
      result[key] = ExpansionLibrary._expandType(types, key);
    });
    return result;
    // return ConsistencyHelper.makeConsistent(result);
  }

  static prepareTypes(types) {
    var result = {};
    if (Array.isArray(types)) {
      types.forEach(type => {
        let key = Object.keys(type)[0];
        let value = type[key];
        result[key] = ExpansionLibrary._prepareType(value);
      });
    } else {
      Object.keys(types).forEach(key => {
        let value = types[key];
        result[key] = ExpansionLibrary._prepareType(value);
      });
    }
    return result;
  }

  static _prepareType(obj) {
    if (Array.isArray(obj.type)) {
      if (obj.type.length === 1) {
        obj.type = obj.type[0];
      }
    }
    if (obj.properties && typeof obj.properties === 'object') {
      obj.properties = ExpansionLibrary.prepareTypes(obj.properties);
    }
    if (obj.items && typeof obj.items === 'object') {
      obj.items = ExpansionLibrary.prepareTypes(obj.items);
    }
    return obj;
  }
  /**
   * Expands a single type.
   *
   * @param {Object} types A map of RAML types
   * @param {String} key A key of currently processed type.
   * @return {Promise} Resolved to expanded canonical form of the type.
   */
  static _expandType(types, key) {
    var library = isNode ? require('datatype-expansion') : expansion;
    var expanded;
    try {
      expanded = library.expandedForm(types[key], types);
    } catch (e) {
      console.warn(e);
      return types[key];
    }
    var canonical;
    try {
      canonical = library.canonicalForm(expanded);
    } catch (e) {
      console.warn('Unable to get canonical form for ', key);
      console.warn(e);
      return expanded;
    }
    return canonical;
  }
}

module.exports.ExpansionLibrary = ExpansionLibrary;

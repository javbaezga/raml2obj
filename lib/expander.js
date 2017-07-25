'use strict';
/* global self */
const {ConsistencyHelper} = require('./consistency-helpers');

var isNode = true;
if (typeof window !== 'undefined' || (typeof self !== 'undefined' && self.origin)) {
  isNode = false;
}

/* global datatype_expansion */

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
    var keys = Object.keys(types);
    if (!keys.length) {
      return Promise.resolve(types);
    }
    var promises = keys.map((key) => ExpansionLibrary._expandType(types, key));
    return Promise.all(promises)
    .then((results) => {
      results.forEach((result) => {
        types[result[0]] = result[1];
      });
      return types;
    })
    .then(result => ConsistencyHelper.makeConsistent(result));
  }
  /**
   * Expands a single type.
   *
   * @param {Object} types A map of RAML types
   * @param {String} key A key of currently processed type.
   * @return {Promise} Resolved to expanded canonical form of the type.
   */
  static _expandType(types, key) {
    return new Promise((resolve) => {
      // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
      var library = isNode ? require('datatype-expansion') : datatype_expansion.js;
      library.expandedForm(types[key], types, (err, expanded) => {
        if (err) {
          console.warn(err);
          return resolve([key, types[key]]);
        }
        if (expanded) {
          library.canonicalForm(expanded, (err2, canonical) => {
            if (err2) {
              console.warn(err2);
              return resolve([key, types[key]]);
            }
            if (canonical) {
              resolve([key, canonical]);
            } else {
              resolve([key, types[key]]);
            }
          });
        } else {
          resolve([key, types[key]]);
        }
      });
      // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
    });
  }
}

module.exports.ExpansionLibrary = ExpansionLibrary;

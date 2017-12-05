'use strict';
/* global self */
const {ConsistencyHelper} = require('./consistency-helpers');

var isNode = true;
if (typeof window !== 'undefined' || (typeof self !== 'undefined' && self.importScripts)) {
  isNode = false;
}

const hasPerformance = !!(typeof performance !== 'undefined' && performance.mark &&
  performance.measure && performance.getEntriesByType);

/* global expansion */

/**
 * Uses Mulesoft's expansion library for RAML types.
 */
class ExpansionLibrary {

  /**
   * Creates a marked timestamp in the performance API if it's available.
   * @param {String} name Mark name.
   */
  static mark(name) {
    if (!hasPerformance) {
      return;
    }
    performance.mark(name);
  }

  static getMeasurements() {
    if (!hasPerformance) {
      return [];
    }
    var marks = performance.getEntriesByType('mark');
    var result = [];
    marks.forEach(item => {
      if (item.name.indexOf('expanding-') === -1) {
        return;
      }
      if (item.name.indexOf('-start') === -1) {
        return;
      }
      let key = item.name.substr(10);
      key = key.replace('-start', '');
      performance.measure(key, item.name, 'expanding-' + key + '-end');
      let mark = performance.getEntriesByName(key)[0];
      result.push({
        duration: mark.duration,
        name: mark.name,
        title: 'Expanding type: ' + key
      });
    });
    performance.measure('making-expansion-consistent',
      'making-expansion-consistent-start',
      'making-expansion-consistent-end');
    var mark = performance.getEntriesByName('making-expansion-consistent')[0];
    result.push({
      duration: mark.duration,
      name: mark.name,
      title: 'Making expansion result consistent'
    });
    return result;
  }

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
  static expandRootTypes(types, measure) {
    if (!types) {
      return Promise.resolve(types);
    }
    var keys = Object.keys(types);
    if (!keys.length) {
      return Promise.resolve(types);
    }
    return ExpansionLibrary._recursiveExpand(keys, types, measure)
    .then(result => {
      if (measure) {
        ExpansionLibrary.mark('making-expansion-consistent-start');
      }
      var data = ConsistencyHelper.makeConsistent(result);
      if (measure) {
        ExpansionLibrary.mark('making-expansion-consistent-end');
      }
      return data;
    });
  }

  static _recursiveExpand(keys, types, measure) {
    var key = keys.shift();
    if (!key) {
      return types;
    }
    return ExpansionLibrary._expandType(types, key, measure)
    .then(result => {
      types[key] = result[1];
      return ExpansionLibrary._recursiveExpand(keys, types, measure);
    });
  }

  /**
   * Expands a single type.
   *
   * @param {Object} types A map of RAML types
   * @param {String} key A key of currently processed type.
   * @return {Promise} Resolved to expanded canonical form of the type.
   */
  static _expandType(types, key, measure) {
    return new Promise((resolve) => {
      var library = isNode ? require('datatype-expansion') : expansion;
      if (measure) {
        ExpansionLibrary.mark('expanding-' + key + '-start');
      }
      library.expandedForm(types[key], types, (err, expanded) => {
        if (err) {
          // console.warn(err);
          if (measure) {
            ExpansionLibrary.mark('expanding-' + key + '-end');
          }
          return resolve([key, types[key]]);
        }
        if (expanded) {
          library.canonicalForm(expanded, (err2, canonical) => {
            if (measure) {
              ExpansionLibrary.mark('expanding-' + key + '-end');
            }
            if (err2) {
              // console.warn(err2);
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
    });
  }
}

module.exports.ExpansionLibrary = ExpansionLibrary;

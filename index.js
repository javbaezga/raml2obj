'use strict';

/**
 * This library is meant to work in browser. It's hidden dependency is
 * https://github.com/raml-org/raml-parser-toolbelt
 * This library require to include it's browser/index.js script included into the document.
 * Then the `datatype_expansion.js` global variable will be available which is used
 * to extend RAML properties.
 *
 * Compering to original library it is also missing a raml js parser. In ARC this library
 * is used alongside own RAML parser implementation.
 *
 * Use `npm run browser` to build the script in `./build` folder. Final library if the
 * `raml2object.js`. It exposes `window.raml2object.parse` function to be used with parser output.
 */
const {RamlJsonEnhancer} = require('./lib/enhencer');
const {arraysToObjects} = require('./lib/arrays-objects');
const {ExpansionLibrary} = require('./lib/expander');
/**
 * Performs full RAML JavaScript object normalization.
 *
 * This task can be expaned to:
 * - `prepareObject()`
 * - `expandTypes()`
 * - `normalize()`
 *
 * @param {Object} opts Enhance configuration options
 * - {Object} json Required. The JSON to enhance
 * - {Boolean} takeMeasurements - If true then performance will be measured
 * when enhancing JSON.
 * @return {Promise} Promise resolved to an object:
 * - {Object} `json` Enhanced JSON
 * - {?Array<Object>} `measurement` Only if `takeMeasurements` was set as an option.
 * Measurement result.
 */
module.exports.parse = function(opts) {
  opts = opts || {};
  if (!opts.json) {
    return Promise.reject(new Error('Required `json` property not found.'));
  }
  const r2o = new RamlJsonEnhancer(opts);
  return r2o.enhance(opts.json);
};

/**
 * Initial transformer before type expansion takes place.
 * It normalizes objects structure.
 *
 * @param {Object} json RALM js parser json output.
 * @return {Promise} Resolved promise to normalized Object that can be used to
 * expand root types. Resolved object have `json` property with transformed
 * object.
 */
module.exports.prepareObject = function(json) {
  const result = {
    json: []
  };
  if (!json) {
    return Promise.resolve(result);
  }
  arraysToObjects(json);
  result.json = json;
  return Promise.resolve(result);
};

/**
 * A function to be called to expand RAML types.
 *
 * @param {Array} types List of types to expand.
 * @return {Promise} Resolved promise to an Object:
 * - `types` {Array} expanded root types
 */
module.exports.expandTypes = function(types) {
  const result = {
    types: []
  };
  if (!types || !Object.keys(types).length) {
    return Promise.resolve(result);
  }
  return ExpansionLibrary.expandRootTypes(types)
  .then((expanded) => {
    result.types = expanded;
    return result;
  });
};

/**
 * Initial transformer before type expansion takes place.
 * It normalizes objects structure.
 *
 * @param {Object} json RALM js parser json output.
 * @param {?Array} types RAML (expanded) root types.
 * @return {Promise} Resolved promise to an Object:
 * - `json` {Object} Normalized RAML object
 */
module.exports.normalize = function(json, types) {
  const result = {
    json: []
  };
  if (!json) {
    return Promise.resolve(result);
  }
  const r2o = new RamlJsonEnhancer();
  json = r2o.normalize(json, types);
  result.json = json;
  return Promise.resolve(result);
};

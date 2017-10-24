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
 * @param {Object} json RALM js parser json output.
 * @return {Object} Enhanced RAML object.
 */
module.exports.parse = function(json) {
  const r2o = new RamlJsonEnhancer();
  return r2o.enhance(json);
};

/**
 * Initial transformer before type expansion takes place.
 * It normalizes objects structure.
 *
 * @param {Object} json RALM js parser json output.
 * @return {Object} Normalized Object that can be used to
 * expand root types. Resolved object have `json` property with transformed
 * data.
 */
module.exports.prepareObject = function(json) {
  const result = {
    json: []
  };
  if (!json) {
    return result;
  }
  arraysToObjects(json);
  result.json = json;
  return result;
};

/**
 * A function to be called to expand RAML types.
 *
 * @param {Array} types List of types to expand.
 * @return {Object} Object with the following properties:
 * - `types` {Array} expanded root types
 */
module.exports.expandTypes = function(types) {
  const result = {
    types: []
  };
  if (!types || !Object.keys(types).length) {
    return result;
  }
  result.types = ExpansionLibrary.expandRootTypes(types);
  return result;
};

/**
 * Initial transformer before type expansion takes place.
 * It normalizes objects structure.
 *
 * @param {Object} json RALM js parser json output.
 * @param {?Array} types RAML (expanded) root types.
 * @return {Object}  Object with the following properties:
 * - `json` {Object} Normalized RAML object
 */
module.exports.normalize = function(json, types) {
  const result = {
    json: []
  };
  if (!json) {
    return result;
  }
  const r2o = new RamlJsonEnhancer();
  json = r2o.normalize(json, types);
  result.json = json;
  return result;
};

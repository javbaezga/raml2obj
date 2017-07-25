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
const {PerformanceAnalyzer} = require('./lib/analyzer');
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
 * @return {Promise} Resolved promise to enhanced RAML object.
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
 * @param {?Object} opts Additional options:
 * - `analyze` {Boolean} If set it will return stats from `analyzer`
 * @return {Promise} Resolved promise to normalized Object that can be used to
 * expand root types. Resolved object have `json` property with transformed
 * object and depending on `opts` it may have `analyzer` property.
 */
module.exports.prepareObject = function(json, opts) {
  opts = opts || {};
  const result = {
    json: []
  };
  if (opts.analyze) {
    result.analyzer = [];
  }
  if (!json) {
    return Promise.resolve(result);
  }
  var analyzer;
  if (opts.analyze) {
    analyzer = new PerformanceAnalyzer(true);
    analyzer.mark('raml2obj-prepare-json-start');
  }
  arraysToObjects(json);
  if (opts.analyze) {
    analyzer = new PerformanceAnalyzer(true);
    analyzer.mark('raml2obj-prepare-json-stop');
  }
  result.json = json;
  if (opts.analyze) {
    result.analyzer = analyzer.getMeasurements('raml2obj-prepare-json');
  }
  return Promise.resolve(result);
};

/**
 * A function to be called to expand RAML types.
 *
 * @param {Array} types List of types to expand.
 * @param {?Object} opts Additional options:
 * - `analyze` {Boolean} If set it will return stats from `analyzer`
 * @return {Promise} Resolved promise to an Object:
 * - `types` {Array} expanded root types
 * - `analyzer` {?Array} Optional, if `opts.analyze` is set, result of analyzer
 */
module.exports.expandTypes = function(types, opts) {
  opts = opts || {};
  const result = {
    types: []
  };
  if (opts.analyze) {
    result.analyzer = [];
  }
  if (!types || !Object.keys(types).length) {
    return Promise.resolve(result);
  }
  var analyzer;
  if (opts.analyze) {
    analyzer = new PerformanceAnalyzer(true);
    analyzer.mark('raml2obj-expanding-root-types-start');
  }
  return ExpansionLibrary.expandRootTypes(types)
  .then((expanded) => {
    if (opts.analyze) {
      analyzer.mark('raml2obj-expanding-root-types-end');
      result.analyzer = analyzer.getMeasurements('raml2obj-expanding-root-types');
    }
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
 * @param {?Object} opts Additional options:
 * - `analyze` {Boolean} If set it will return stats from `analyzer`
 * @return {Promise} Resolved promise to an Object:
 * - `json` {Object} Normalized RAML object
 * - `analyzer` {?Array} Optional, if `opts.analyze` is set, result of analyzer
 */
module.exports.normalize = function(json, types, opts) {
  opts = opts || {};
  const result = {
    json: []
  };
  if (opts.analyze) {
    result.analyzer = [];
  }
  if (!json) {
    return Promise.resolve(result);
  }
  var analyzer;
  if (opts.analyze) {
    analyzer = new PerformanceAnalyzer(true);
    analyzer.mark('raml2obj-normalize-start');
  }
  const r2o = new RamlJsonEnhancer(opts);
  json = r2o.normalize(json, types);
  if (opts.analyze) {
    analyzer.mark('raml2obj-normalize-stop');
  }
  result.json = json;
  if (opts.analyze) {
    result.analyzer = analyzer.getMeasurements('raml2obj-normalize-json');
  }
  return Promise.resolve(result);
};

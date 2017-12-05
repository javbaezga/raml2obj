'use strict';
const {arraysToObjects, recursiveObjectToArray} = require('./arrays-objects');
const {ExpansionLibrary} = require('./expander');
const {ConsistencyHelper} = require('./consistency-helpers');
const {SecuritySchemesTransformer} = require('./security-schemes');

const hasPerformance = !!(typeof performance !== 'undefined' && performance.mark &&
  performance.measure && performance.getEntriesByType);
const ARR2OBJ_MARK = 'array-2-obj';
const EXPAND_MARK = 'expansion';
const NORMALIZE_MARK = 'normalization';
/**
 * The RAML JSON enhancer library for node.
 *
 * This library is inspired by the raml2object library
 * (https://github.com/raml2html/raml2obj) and uses some of it's code.
 * However it was adjusted to work with Advanced REST Client elements
 * to create the API console (by Mulesoft).
 *
 * Use this library to "enhance" JSON output of the raml-js-parser-2
 * that can be used with the API console or any other RAML related ARC element.
 */
class RamlJsonEnhancer {
  /**
   * @param {?Object} opts Enhancer options:
   * - {Boolean} takeMeasurements - If true then performance will be measured
   * when enhancing JSON.
   */
  constructor(opts) {
    opts = opts || {};
    this.takeMeasurements = opts.takeMeasurements || false;
  }
  /**
   * Creates a marked timestamp in the performance API if it's available.
   * @param {String} name Mark name.
   */
  mark(name) {
    if (!hasPerformance) {
      return;
    }
    performance.mark(name);
  }

  _measureRersult(name, title) {
    var mark = performance.getEntriesByName(name)[0];
    return {
      duration: mark.duration,
      name: mark.name,
      title: title
    };
  }
  /**
   * Returns an array of taken measurements.
   *
   * Each object contains:
   * - duration (Number) execution time as a hi-res performance time
   * - title (String) Human readable title
   * - name (String) unique sting representing measurement type.
   *
   * This returns empty array if performance API is not available.
   *
   * @return {Array<Object>} Taken measurements.
   */
  getMeasurements() {
    if (!hasPerformance) {
      return [];
    }
    performance.measure(ARR2OBJ_MARK, ARR2OBJ_MARK + '-start', ARR2OBJ_MARK + '-end');
    performance.measure(EXPAND_MARK, EXPAND_MARK + '-start', EXPAND_MARK + '-end');
    performance.measure(NORMALIZE_MARK, NORMALIZE_MARK + '-start', NORMALIZE_MARK + '-end');
    var result = [];
    result.push(this._measureRersult(ARR2OBJ_MARK, 'Array to object tranformation'));
    result.push(this._measureRersult(EXPAND_MARK, 'Datatype expansion'));
    result.push(this._measureRersult(NORMALIZE_MARK, 'Data model normalization'));

    var additional = ExpansionLibrary.getMeasurements();
    result = result.concat(additional);

    performance.clearMarks();
    performance.clearMeasures();
    return result;
  }

  /**
   * Enchances RAML's JSON parser output by normalizing data type structure and
   * by expanding types definition useing the datatype_expansion library.
   *
   * @param {Object} raml The JSON output from the raml-js-parser-2
   * @return {Promise} Fulfilled object with enhanced JSON structure as a `json`
   * property of returned object.
   */
  enhance(raml) {
    var perf = this.takeMeasurements;
    if (perf) {
      this.mark(ARR2OBJ_MARK + '-start');
    }
    arraysToObjects(raml);
    if (perf) {
      this.mark(ARR2OBJ_MARK + '-end');
      this.mark(EXPAND_MARK + '-start');
    }
    return ExpansionLibrary.expandRootTypes(raml.types, perf)
    .then((expanded) => {
      if (perf) {
        this.mark(EXPAND_MARK + '-end');
        this.mark(NORMALIZE_MARK + '-start');
      }
      return this.normalize(raml, expanded);
    })
    .then(data => {
      let result = {
        json: data
      };
      if (perf) {
        this.mark(NORMALIZE_MARK + '-end');
        result.measurement = this.getMeasurements();
      }
      return result;
    });
  }
  /**
   * Normalizes RAML JavaScript object applying expanded root types and
   * by normalizing properties values of the object.
   *
   * @param {Object} raml An object to normalize. Output of the RAML javascript
   * parser
   * @param {Array} types List of (expanded) RAML types as JavaScript object
   * @return {Object} Normalized RAML object.
   */
  normalize(raml, types) {
    delete raml.types;
    this._transformTypesToArrays(types);
    this._transformObjectsToArrays(raml);
    this._makeRamlConsistent(raml, types);
    this._normalizeObject(raml);
    if (types) {
      raml.types = types;
    }
    return raml;
  }

  _makeRamlConsistent(raml, types) {
    if (types) {
      Object.keys(types).forEach(key => {
        types[key] = ConsistencyHelper.consistentExample(types[key]);
      });
    }
    ConsistencyHelper.makeConsistent(raml, types);
  }

  _transformObjectsToArrays(raml) {
    recursiveObjectToArray(raml);
  }

  _transformTypesToArrays(types) {
    recursiveObjectToArray(types);
  }

  _normalizeObject(raml) {
    var rootTypes = {
      securitySchemes: raml.securitySchemes
    };
    var computeBaseUri = !this.hasProperBaseUri(raml);
    var opts = {
      computeBaseUri: computeBaseUri,
      baseUri: raml.baseUri
    };
    this.enhaceJson(raml, rootTypes, opts);
  }
  /**
   * Recursevily adds the URI parameters to methods and resources.
   * It also applies security schemas definitions on a resource and method level.
   *
   * Affected properties:
   * - resource/parentUrl - a full URL of the parent resource
   * - resource/allUriParameters - list of all URI parameters that apply to this
   * resource (computed from the root down to current resource)
   * - resource/securedBy - Replaces security schema name with schema's
   * definition.
   * - method/allUriParameters - The same as for a resource but applied to a
   * method that is direct child of the resource.
   * - method/absoluteUri - Full, absolute URL to the method containg URI
   * parametes in their RAML's form, eg `/{fileId}`
   * - method/securedBy - The same as for the resource
   */
  enhaceJson(ramlObj, rootTypes, opts) {
    if (!ramlObj.resources) {
      return;
    }
    ramlObj.resources.forEach((resource) => {
      resource.parentUrl = opts.parentUrl || '';
      resource.allUriParameters = ramlObj.baseUriParameters ?
        this._clone(ramlObj.baseUriParameters) : [];

      if (opts.computeBaseUri) {
        resource.absoluteUri = opts.baseUri + resource.relativeUri;
      }

      if (opts.allUriParameters) {
        resource.allUriParameters = resource.allUriParameters.concat(opts.allUriParameters);
      }

      if (resource.baseUriParameters) {
        // Fixes https://github.com/mulesoft/api-console/issues/136
        resource.allUriParameters =
          this._mergeBaseParameters(resource.allUriParameters, resource.baseUriParameters);
      }

      if (resource.uriParameters) {
        resource.allUriParameters = resource.allUriParameters.concat(resource.uriParameters);
      }

      let fullRelativeUri = resource.parentUrl + resource.relativeUri;

      // Copy the RESOURCE uri parameters to the METHOD, because that's where they will be rendered.
      if (resource.methods) {
        resource.methods.forEach((method) => {
          method.allUriParameters = resource.allUriParameters;
          method.absoluteUri = resource.absoluteUri;
          method.relativeUri = fullRelativeUri;
          method.baseUri = opts.baseUri;
          SecuritySchemesTransformer.addSecuritSchemes(method, rootTypes.securitySchemes);
        });
      }
      SecuritySchemesTransformer.addSecuritSchemes(resource, rootTypes.securitySchemes);
      let optsCopy = Object.assign({}, opts);
      optsCopy.parentUrl = fullRelativeUri;
      optsCopy.allUriParameters =
        resource.allUriParameters ? this._clone(resource.allUriParameters) : [];
      this.enhaceJson(resource, rootTypes, optsCopy);
    });
  }
  /**
   * Temporaily fixes https://github.com/raml-org/raml-js-parser-2/issues/779
   *
   * @param {Object} raml RAML json data
   * @return {Boolean} True if the `baseUri` matches first resources `absoluteUri`
   */
  hasProperBaseUri(raml) {
    if (!raml || !raml.resources || !raml.resources[0]) {
      return true;
    }
    if (!raml.baseUri) {
      // Nothing I can do here.
      return true;
    }
    var resourceUri = raml.resources[0].absoluteUri;
    if (!resourceUri) {
      return false;
    }
    var baseUri = raml.baseUri;
    return resourceUri.indexOf(baseUri) === 0;
  }

  /**
   * Nerges two arrays as follows:
   * - if `dest.index.name` equals to any name in the `source` array then
   * the object will be merged
   * - otherwise, new item will be added to the dest.
   *
   * @param {Array} dest Destination array. Existing values will be overridden
   * @param {Array} source Array to copy values from.
   * @return {Array} Merged array
   */
  _mergeBaseParameters(dest, source) {
    source = source || [];
    dest = dest ? this._clone(dest) : [];
    for (let i = 0, len = source.length; i < len; i++) {
      let item = source[i];
      let replaced = false;
      for (let j = 0, dLen = dest.length; j < dLen; j++) {
        if (dest[j].name === item.name) {
          replaced = true;
          dest[j] = Object.assign(dest[j], item);
          break;
        }
      }
      if (!replaced) {
        dest.push(item);
      }
    }
    return dest;
  }

  /**
   * Detects if passed object is an array.
   * @param {any} obj Object to test
   * @return {Boolean} True if passed ibject is an array.
   */
  _isArray(obj) {
    return Object.prototype.toString.apply(obj) === '[object Array]';
  }

  /**
   * Deep clones an object.
   * @param {any} obj An object to be cloned.
   * @return {any} Copy of an object.
   */
  _clone(obj) {
    var result;
    var i;
    if (typeof obj !== 'object') {
      return obj;
    }
    if (!obj) {
      return obj;
    }
    if (this._isArray(obj)) {
      result = [];
      for (i = 0; i < obj.length; i += 1) {
        result[i] = this._clone(obj[i]);
      }
      return result;
    }
    result = {};
    for (i in obj) {
      if (obj.hasOwnProperty(i)) {
        result[i] = this._clone(obj[i]);
      }
    }
    return result;
  }
}

module.exports.RamlJsonEnhancer = RamlJsonEnhancer;

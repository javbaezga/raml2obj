'use strict';
const {arraysToObjects, recursiveObjectToArray} = require('./arrays-objects');
const {PerformanceAnalyzer} = require('./analyzer');
const {ExpansionLibrary} = require('./expander');
const {ConsistencyHelper} = require('./consistency-helpers');
const {SecuritySchemesTransformer} = require('./security-schemes');
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

  constructor(opts) {
    opts = opts || {};
    this.analyzer = new PerformanceAnalyzer(opts.analyze);
  }

  /**
   * Enchances RAML's JSON parser output by normalizing data type structure and
   * by expanding types definition useing the datatype_expansion library.
   *
   * @param {Object} raml The JSON output from the raml-js-parser-2
   * @return {Promise} Fulfilled object with enhanced JSON structure.
   */
  enhance(raml) {
    arraysToObjects(raml);
    return ExpansionLibrary.expandRootTypes(raml.types)
    .then((expanded) => {
      return this.normalize(raml, expanded);
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
    this._makeRamlConsistent(raml, types);
    this._transformObjectsToArrays(raml);
    this._normalizeObject(raml);
    if (types) {
      raml.types = types;
    }
    return raml;
  }

  _makeRamlConsistent(raml, types) {
    this.analyzer.mark('raml-enhancer-make-raml-consistent-start');
    ConsistencyHelper.makeConsistent(raml, types);
    this.analyzer.mark('raml-enhancer-make-raml-consistent-end');
  }

  _transformObjectsToArrays(raml) {
    this.analyzer.mark('raml-enhancer-make-raml-consistent-start');
    recursiveObjectToArray(raml);
    this.analyzer.mark('raml-enhancer-make-raml-consistent-end');
  }

  _normalizeObject(raml) {
    this.analyzer.mark('raml-enhancer-recursive-normalization-start');
    var rootTypes = {
      securitySchemes: raml.securitySchemes
    };
    this.enhaceJson(raml, rootTypes);
    this.analyzer.mark('raml-enhancer-recursive-normalization-end');
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
  enhaceJson(ramlObj, rootTypes, parentUrl, allUriParameters) {
    if (!ramlObj.resources) {
      return;
    }

    ramlObj.resources.forEach((resource) => {
      resource.parentUrl = parentUrl || '';
      resource.allUriParameters = ramlObj.baseUriParameters || [];

      if (allUriParameters) {
        resource.allUriParameters = resource.allUriParameters.concat(allUriParameters);
      }

      if (resource.uriParameters) {
        resource.allUriParameters = resource.allUriParameters.concat(resource.uriParameters);
      }

      // Copy the RESOURCE uri parameters to the METHOD, because that's where they will be rendered.
      if (resource.methods) {
        resource.methods.forEach((method) => {
          method.allUriParameters = resource.allUriParameters;
          method.absoluteUri = resource.absoluteUri;
          SecuritySchemesTransformer.addSecuritSchemes(method, rootTypes.securitySchemes);
        });
      }
      SecuritySchemesTransformer.addSecuritSchemes(resource, rootTypes.securitySchemes);
      let fullUrl = resource.parentUrl + resource.relativeUri;
      this.enhaceJson(resource, rootTypes, fullUrl, resource.allUriParameters);
    });
  }
}

module.exports.RamlJsonEnhancer = RamlJsonEnhancer;

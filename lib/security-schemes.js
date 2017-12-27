'use strict';

/**
 * Transforms security schemes of RAML object.
 */
class SecuritySchemesTransformer {
  // Checks if given `obj` is an Object.
  static isObject(obj) {
    return obj && obj === Object(obj) && !Array.isArray(obj);
  }
  /**
   * Detects and adds security scheme definitions to the object.
   *
   * It replaces the id of the security scheme on a resource / method level with
   * Security Scheme type definition.
   *
   * @param {Object} object An object where security schemes should be applied.
   * Either RAML method or resource
   * @param {Object} rootSchemes Defined on a root level list of security
   * schemes.
   */
  static addSecuritSchemes(object, rootSchemes) {
    if (!rootSchemes || !Object.keys(rootSchemes).length) {
      return;
    }
    if (!object || !object.securedBy || !object.securedBy.length) {
      return;
    }
    var added = false;
    object.securedBy.forEach((item, i) => {
      if (typeof item === 'string') {
        if (item in rootSchemes) {
          added = true;
          object.securedBy[i] = Object.assign({}, rootSchemes[item]);
        }
      } else if (SecuritySchemesTransformer.isObject(item)) {
        let keys = Object.keys(item);
        let key = keys[0];
        if (key in rootSchemes) {
          added = true;
          let schema = Object.assign({}, rootSchemes[key]);
          let params = item[key];
          schema.settings = Object.assign({}, schema.settings, params);
          object.securedBy[i] = schema;
        }
      }
    });
    if (added) {
      SecuritySchemesTransformer.transform(object);
    }
  }

  /**
   * Applies security schemas properties to the resources and methods.
   * If the security scheme has the `describedBy` field then corresponding fields
   * will be updated.
   *
   * This function should be called once per object since it won't check
   * if the properties from the security scheme was already applied.
   *
   * This function returns nothing. Changes are made deep inside the object
   * so it is resolved by referewnce.
   *
   * @param {Object} object resource or method definition
   */
  static transform(object) {
    if (!object.queryParameters) {
      object.queryParameters = [];
    }
    if (!object.headers) {
      object.headers = [];
    }
    if (!object.securedBy) {
      object.securedBy = [];
    }
    var responses = [];
    object.securedBy.forEach(scheme => {
      if (!scheme || typeof scheme === 'string') {
        return;
      }
      if (scheme.describedBy) {
        if (scheme.describedBy.queryParameters) {
          object.queryParameters = object.queryParameters
            .concat(scheme.describedBy.queryParameters);
        }
        if (scheme.describedBy.headers) {
          object.headers = object.headers.concat(scheme.describedBy.headers);
        }
        if (scheme.describedBy.responses) {
          responses = responses.concat(scheme.describedBy.responses);
        }
      }
    });
    if (object.responses) {
      responses = responses.concat(object.responses);
    }
    responses.sort(function(a, b) {
      var aCode = Number(a.code);
      var bCode = Number(b.code);
      if (aCode > bCode) {
        return 1;
      }
      if (aCode < bCode) {
        return -1;
      }
      return 0;
    });
    object.responses = responses;
  }
}

module.exports.SecuritySchemesTransformer = SecuritySchemesTransformer;

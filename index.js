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
/* global datatype_expansion */
const makeConsistent = require('./consistency-helpers');
const {arraysToObjects, recursiveObjectToArray} = require('./arrays-objects-helpers');

class Raml2Object {

  constructor(object) {
    this.raml = object;
  }

  enhance() {
    if (performance && performance.mark) {
      performance.mark('raml2obj-enhace-start');
    }
    if (performance && performance.mark) {
      performance.mark('raml2obj-arrays-to-object-start');
    }
    arraysToObjects(this.raml);
    if (performance && performance.mark) {
      performance.mark('raml2obj-arrays-to-object-end');
    }
    if (performance && performance.mark) {
      performance.mark('raml2obj-expanding-root-types-start');
    }
    const expanded = this.expandRootTypes(this.raml.types);
    if (performance && performance.mark) {
      performance.mark('raml2obj-expanding-root-types-end');
    }
    if (performance && performance.mark) {
      performance.mark('raml2obj-make-consistent-root-types-start');
    }
    const types = makeConsistent(expanded);
    if (performance && performance.mark) {
      performance.mark('raml2obj-make-consistent-root-types-end');
    }
    delete this.raml.types;
    if (performance && performance.mark) {
      performance.mark('raml2obj-make-consistent-raml-start');
    }
    makeConsistent(this.raml, types);
    if (performance && performance.mark) {
      performance.mark('raml2obj-make-consistent-raml-end');
    }
    if (performance && performance.mark) {
      performance.mark('raml2obj-recursive-object-to-array-start');
    }
    recursiveObjectToArray(this.raml);
    if (performance && performance.mark) {
      performance.mark('raml2obj-recursive-object-to-array-end');
    }
    this.securitySchemes = this.raml.securitySchemes;
    if (performance && performance.mark) {
      performance.mark('raml2obj-apply-raml-types-start');
    }
    this.applyRamlTypes(this.raml);
    if (performance && performance.mark) {
      performance.mark('raml2obj-apply-raml-types-end');
    }
    if (types) {
      this.raml.types = types;
    }
    if (performance && performance.mark) {
      performance.mark('raml2obj-enhace-end');
    }
    return this.raml;
  }

  /**
   * Applies security schemas properties to the resources and methods.
   * If the security scheme has a `describedBy` field the corresponding fields
   * will be updated.
   *
   * This function should be called once per object since it won't check
   * if the properties from the security schema was already applied.
   *
   * This function returns nothing. Changes are made deep inside the object
   * so it is resolved by referewnce.
   *
   * @param {Object} object resource or method definition
   */
  applySecuritySchemes(object) {
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
    object.securedBy.forEach(function(scheme) {
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

  /**
   * Detect and add security scheme definitions to the object.
   * It replaces the id of the security scheme on a resource / method level with
   * Security Scheme type definition.
   *
   * @param {Object} object An object where security schemes should be applied. Either RAML method
   * or resource
   * @param {Object} rootSchemes Defined on a root level security schemes.
   */
  addSecuritSchemes(object) {
    var rootSchemes = this.securitySchemes;
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
          object.securedBy[i] = rootSchemes[item];
        }
      }
    });
    if (added) {
      this.applySecuritySchemes(object);
    }
  }

  /**
   * Adds URI parameters to methods and resources to the lowest level in the resource hierarchy.
   * Also applies security schemas definitions on a resource and method level.
   */
  applyRamlTypes(ramlObj, parentUrl, allUriParameters) {
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
          this.addSecuritSchemes(method);
        });
      }
      this.addSecuritSchemes(resource);

      this.applyRamlTypes(resource, resource.parentUrl + resource.relativeUri,
        resource.allUriParameters);
    });
  }

  // This uses the datatype-expansion library to expand all the root type to their canonical
  // expanded form
  expandRootTypes(types) {
    if (!types) {
      return types;
    }

    Object.keys(types).forEach((key) => {
      // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
      datatype_expansion.js.expandedForm(types[key], types, (err, expanded) => {
        if (expanded) {
          datatype_expansion.js.canonicalForm(expanded, (err2, canonical) => {
            if (canonical) {
              types[key] = canonical;
            }
          });
        }
      });
      // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
    });
    return types;
  }
}

module.exports.parse = function(source) {
  const r2o = new Raml2Object(source);
  return r2o.enhance();
};

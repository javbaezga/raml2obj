"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
      }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
        var n = t[o][1][e];return s(n ? n : e);
      }, l, l.exports, e, t, n, r);
    }return n[o].exports;
  }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
    s(r[o]);
  }return s;
})({ 1: [function (require, module, exports) {
    var raml2obj = require('./');
    /* global self */
    if (typeof window === 'undefined') {
      // Web worker environment.
      self.raml2obj = raml2obj;
    } else {
      window.raml2obj = raml2obj;
    }
  }, { "./": 2 }], 2: [function (require, module, exports) {
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

    var _require = require('./lib/analyzer'),
        PerformanceAnalyzer = _require.PerformanceAnalyzer;

    var _require2 = require('./lib/enhencer'),
        RamlJsonEnhancer = _require2.RamlJsonEnhancer;

    var _require3 = require('./lib/arrays-objects'),
        arraysToObjects = _require3.arraysToObjects;

    var _require4 = require('./lib/expander'),
        ExpansionLibrary = _require4.ExpansionLibrary;
    /**
     * Performs full RAML JavaScript object normalization.
     *
     * This task can be expaned to:
     * - `prepareObject()`
     * - `expandTypes()`
     * - `normalize()`
     *
     * @param {[type]} source [description]
     * @return {[type]} [description]
     */


    module.exports.parse = function (source) {
      var r2o = new RamlJsonEnhancer();
      return r2o.enhance(source);
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
    module.exports.prepareObject = function (json, opts) {
      var result = {
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
    module.exports.expandTypes = function (types, opts) {
      var result = {
        types: []
      };
      if (opts.analyze) {
        result.analyzer = [];
      }
      if (!types || !types.length) {
        return Promise.resolve(result);
      }
      var analyzer;
      if (opts.analyze) {
        analyzer = new PerformanceAnalyzer(true);
        analyzer.mark('raml2obj-expanding-root-types-start');
      }
      return ExpansionLibrary.expandRootTypes(types).then(function (expanded) {
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
    module.exports.normalize = function (json, types, opts) {
      var result = {
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
      var r2o = new RamlJsonEnhancer(opts);
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
  }, { "./lib/analyzer": 3, "./lib/arrays-objects": 4, "./lib/enhencer": 6, "./lib/expander": 7 }], 3: [function (require, module, exports) {
    'use strict';

    /**
     * Analyzer analyze performance of the script.
     */

    var PerformanceAnalyzer = function () {
      function PerformanceAnalyzer(enabled) {
        _classCallCheck(this, PerformanceAnalyzer);

        this.hasSupport = enabled && this._hasSupport();
      }

      _createClass(PerformanceAnalyzer, [{
        key: "_hasSupport",
        value: function _hasSupport() {
          return !!(typeof performance !== 'undefined' && performance.mark && performance.clearMeasures && performance.measure);
        }
        /**
         * Uses the performance API to mark time of an event.
         */

      }, {
        key: "mark",
        value: function mark(title) {
          if (!this.hasSupport) {
            return;
          }
          performance.mark(title);
        }

        /**
         * Returns a list of time measurements for given key.
         *
         * The `key` must have corresponding `key` + `start` and `key` + `end`
         * markings in the performance timeline.
         *
         * @param {Array<String>} keys List of keys to return.
         * @return {Array<Object>} List of measurements taken for the key.
         */

      }, {
        key: "getMeasurements",
        value: function getMeasurements(keys) {
          if (!this.hasSupport) {
            return [];
          }
          performance.clearMeasures();
          keys.forEach(function (key) {
            try {
              performance.measure(key, key + '-start', key + '-end');
            } catch (e) {}
          });
          var result = performance.getEntriesByType('measure');
          return result.map(function (item) {
            return {
              name: item.name,
              startTime: item.startTime,
              duration: item.duration
            };
          });
        }
      }]);

      return PerformanceAnalyzer;
    }();

    module.exports.PerformanceAnalyzer = PerformanceAnalyzer;
  }, {}], 4: [function (require, module, exports) {
    /**
     * This code is from https://github.com/raml2html/raml2obj
     */
    /**
    * @license
    * The MIT License (MIT)
    *
    * Copyright (c) 2014 Kevin Renskers
    *
    * Permission is hereby granted, free of charge, to any person obtaining a copy
    * of this software and associated documentation files (the "Software"), to deal
    * in the Software without restriction, including without limitation the rights
    * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    * copies of the Software, and to permit persons to whom the Software is
    * furnished to do so, subject to the following conditions:
    *
    * The above copyright notice and this permission notice shall be included in all
    * copies or substantial portions of the Software.
    *
    * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    * SOFTWARE.
    */
    function _isObject(obj) {
      return obj === Object(obj);
    }

    // EXAMPLE INPUT:
    // {
    //   foo: {
    //     name: "foo!"
    //   },
    //   bar: {
    //     name: "bar"
    //   }
    // }
    //
    // EXAMPLE OUTPUT:
    // [ { name: "foo!", key: "foo" }, { name: "bar", key: "bar" } ]
    function _objectToArray(obj) {
      if (Array.isArray(obj)) {
        return obj;
      }

      return Object.keys(obj).map(function (key) {
        if (_isObject(obj[key])) {
          obj[key].key = key;
        }
        return obj[key];
      });
    }

    // EXAMPLE INPUT:
    // [
    //   { foo: { ... } },
    //   { bar: { ... } },
    // ]
    //
    // EXAMPLE OUTPUT:
    // { foo: { ... }, bar: { ... } }
    function _arrayToObject(arr) {
      return arr.reduce(function (acc, cur) {
        Object.keys(cur).forEach(function (key) {
          acc[key] = cur[key];
        });
        return acc;
      }, {});
    }

    var recussiveArrayProperties = ['responses', 'body', 'queryParameters', 'headers', 'properties', 'baseUriParameters', 'annotations', 'uriParameters'];
    var objectProperties = ['types', 'traits', 'resourceTypes', 'annotationTypes', 'securitySchemes'];

    function recursiveObjectToArray(obj) {
      if (_isObject(obj)) {
        Object.keys(obj).forEach(function (key) {
          var value = obj[key];
          if (_isObject(obj) && recussiveArrayProperties.indexOf(key) !== -1) {
            obj[key] = _objectToArray(value);
          }

          recursiveObjectToArray(value);
        });
      } else if (Array.isArray(obj)) {
        obj.forEach(function (value) {
          recursiveObjectToArray(value);
        });
      }

      return obj;
    }

    // Transform some TOP LEVEL properties from arrays to simple objects
    function arraysToObjects(ramlObj) {
      objectProperties.forEach(function (key) {
        if (key in ramlObj && ramlObj[key]) {
          ramlObj[key] = _arrayToObject(ramlObj[key]);
        }
      });
      return ramlObj;
    }

    module.exports = {
      arraysToObjects: arraysToObjects,
      recursiveObjectToArray: recursiveObjectToArray
    };
  }, {}], 5: [function (require, module, exports) {
    'use strict';

    /**
     * This code is from https://github.com/raml2html/raml2obj
     */

    /**
     * @license
     * The MIT License (MIT)
     *
     * Copyright (c) 2014 Kevin Renskers
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in all
     * copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     * SOFTWARE.
     */

    /**
    * Uses Mulesoft's expansion library for RAML types.
    */

    var ConsistencyHelper = function () {
      function ConsistencyHelper() {
        _classCallCheck(this, ConsistencyHelper);
      }

      _createClass(ConsistencyHelper, null, [{
        key: "isObject",

        /**
         * Checks if the object is type of object.
         *
         * @param {ANY} obj Object to test
         * @return {Boolean} True if the `obj` is type of Object class.
         */
        value: function isObject(obj) {
          return obj && obj === Object(obj) && !Array.isArray(obj);
        }
      }, {
        key: "makeConsistent",
        value: function makeConsistent(obj, types) {
          debugger;
          if (!obj || obj.__typeConsistent) {
            return obj;
          }

          if (Array.isArray(obj)) {
            obj.forEach(function (value, i) {
              obj[i] = ConsistencyHelper.makeConsistent(value, types);
            });
          } else if (ConsistencyHelper.isObject(obj)) {
            if (obj.type) {
              obj = ConsistencyHelper.consistentType(obj, types);
            }

            if (obj.items && types && types[obj.items]) {
              obj.items = types[obj.items];
            }

            obj = ConsistencyHelper.consistentExample(obj);

            var keys = Object.keys(obj);
            keys.forEach(function (key) {
              // if (obj.__typeConsistent && ['properties', 'items'].indexOf(key) !== -1) {
              //   return;
              // }
              obj[key] = ConsistencyHelper.makeConsistent(obj[key], types);
            });
          }
          return obj;
        }

        /**
         * Makes type declaration of a property consistant.
         *
         * @param {Object} obj Currently transformed object. Probably a type
         * declaration as a `property` or `item`.
         * @param {?Array} types List of available types.
         * @return {Object} Transformed object.
         */

      }, {
        key: "consistentType",
        value: function consistentType(obj, types) {
          if (Array.isArray(obj.type)) {
            obj.type = obj.type[0];
          }
          if (types && types[obj.type]) {
            ConsistencyHelper.applyType(obj, types[obj.type]);
          }

          return obj;
        }
        /**
         * Makes examples consistent by creating an array of examples with string
         * example value.
         *
         * @param {Object} obj Currently transformed object. Probably a type
         * declaration as a `property` or `item`.
         * @return {Object} Transformed object.
         */

      }, {
        key: "consistentExample",
        value: function consistentExample(obj) {
          if (obj.examples && obj.examples.length) {
            obj.examples = obj.examples.map(function (example) {
              return example.value ? example.value : example;
            });
          }

          if (obj.structuredExample) {
            if (typeof obj.examples === 'undefined') {
              obj.examples = [];
            }
            obj.examples.push(obj.structuredExample.value);
            delete obj.example;
            delete obj.structuredExample;
          }
          return obj;
        }

        /**
         * Applies type definition to current property.
         * This adds properties from a type declaration to current object respecting
         * object's existing properties.
         *
         * For example `properties`, `items` from `obj` and `typedef` will be
         * merged and inline properties overrides types properties.
         *
         * Examples are merged into one array.
         *
         * `obj`'s inline defined properties (description, enum, default) are preserved.
         *
         * @param {Object} obj Currently transformed object. Must be type
         * declaration as a `property` or `item`.
         * @param {Object} typedef Type definition to apply to the object.
         * @return {Object} Transformed object.
         */

      }, {
        key: "applyType",
        value: function applyType(obj, typedef) {

          var overrideProperties = {
            description: obj.description,
            enum: obj.enum,
            default: obj.default,
            schema: obj.schema,
            xml: obj.xml
          };

          var mergeProperties = {
            properties: obj.properties,
            items: obj.items
          };

          // Examples should be merged instead of being overriden.
          var examples = [];
          if (obj.examples) {
            examples = obj.examples;
            delete obj.examples;
          }
          if (obj.example) {
            examples.push(obj.example);
            delete obj.example;
          }

          obj = Object.assign(obj, typedef);

          if (obj.type && Array.isArray(obj.type)) {
            obj.type = obj.type[0];
          }

          if (!obj.examples) {
            obj.examples = [];
          }

          if (examples.length) {
            obj.examples = obj.examples.merge(examples);
          }

          Object.keys(mergeProperties).forEach(function (key) {
            if (mergeProperties[key] === undefined) {
              return;
            }
            var _temp = Object.assign({}, obj[key]);
            Object.assign(_temp, mergeProperties[key]);
            obj[key] = _temp;
          });

          Object.keys(overrideProperties).forEach(function (key) {
            if (overrideProperties[key] === undefined) {
              return;
            }
            obj[key] = overrideProperties[key];
          });
          // A flag to not process this object again in case of recursive types.
          obj.__typeConsistent = true;
        }
      }]);

      return ConsistencyHelper;
    }();

    module.exports.ConsistencyHelper = ConsistencyHelper;
  }, {}], 6: [function (require, module, exports) {
    'use strict';

    var _require5 = require('./arrays-objects'),
        arraysToObjects = _require5.arraysToObjects,
        recursiveObjectToArray = _require5.recursiveObjectToArray;

    var _require6 = require('./analyzer'),
        PerformanceAnalyzer = _require6.PerformanceAnalyzer;

    var _require7 = require('./expander'),
        ExpansionLibrary = _require7.ExpansionLibrary;

    var _require8 = require('./consistency-helpers'),
        ConsistencyHelper = _require8.ConsistencyHelper;

    var _require9 = require('./security-schemes'),
        SecuritySchemesTransformer = _require9.SecuritySchemesTransformer;
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


    var RamlJsonEnhancer = function () {
      function RamlJsonEnhancer(opts) {
        _classCallCheck(this, RamlJsonEnhancer);

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


      _createClass(RamlJsonEnhancer, [{
        key: "enhance",
        value: function enhance(raml) {
          var _this = this;

          arraysToObjects(raml);
          return ExpansionLibrary.expandRootTypes(raml.types).then(function (expanded) {
            return _this.normalize(raml, expanded);
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

      }, {
        key: "normalize",
        value: function normalize(raml, types) {
          delete raml.types;
          this._makeRamlConsistent(raml, types);
          this._transformObjectsToArrays(raml);
          this._normalizeObject(raml);
          if (types) {
            raml.types = types;
          }
          return raml;
        }
      }, {
        key: "_makeRamlConsistent",
        value: function _makeRamlConsistent(raml, types) {
          this.analyzer.mark('raml-enhancer-make-raml-consistent-start');
          ConsistencyHelper.makeConsistent(raml, types);
          this.analyzer.mark('raml-enhancer-make-raml-consistent-end');
        }
      }, {
        key: "_transformObjectsToArrays",
        value: function _transformObjectsToArrays(raml) {
          this.analyzer.mark('raml-enhancer-make-raml-consistent-start');
          recursiveObjectToArray(raml);
          this.analyzer.mark('raml-enhancer-make-raml-consistent-end');
        }
      }, {
        key: "_normalizeObject",
        value: function _normalizeObject(raml) {
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

      }, {
        key: "enhaceJson",
        value: function enhaceJson(ramlObj, rootTypes, parentUrl, allUriParameters) {
          var _this2 = this;

          if (!ramlObj.resources) {
            return;
          }

          ramlObj.resources.forEach(function (resource) {
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
              resource.methods.forEach(function (method) {
                method.allUriParameters = resource.allUriParameters;
                method.absoluteUri = resource.absoluteUri;
                SecuritySchemesTransformer.addSecuritSchemes(method, rootTypes.securitySchemes);
              });
            }
            SecuritySchemesTransformer.addSecuritSchemes(resource, rootTypes.securitySchemes);
            var fullUrl = resource.parentUrl + resource.relativeUri;
            _this2.enhaceJson(resource, rootTypes, fullUrl, resource.allUriParameters);
          });
        }
      }]);

      return RamlJsonEnhancer;
    }();

    module.exports.RamlJsonEnhancer = RamlJsonEnhancer;
  }, { "./analyzer": 3, "./arrays-objects": 4, "./consistency-helpers": 5, "./expander": 7, "./security-schemes": 8 }], 7: [function (require, module, exports) {
    'use strict';

    var _require10 = require('./consistency-helpers'),
        ConsistencyHelper = _require10.ConsistencyHelper;

    var isNode = false;
    if (typeof module !== 'undefined' && module.exports) {
      isNode = true;
    }

    /* global datatype_expansion */

    /**
     * Uses Mulesoft's expansion library for RAML types.
     */

    var ExpansionLibrary = function () {
      function ExpansionLibrary() {
        _classCallCheck(this, ExpansionLibrary);
      }

      _createClass(ExpansionLibrary, null, [{
        key: "expandRootTypes",


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
        value: function expandRootTypes(types) {
          if (!types) {
            console.warn('expandRootTypes::noting to expand');
            return Promise.resolve(types);
          }
          var keys = Object.keys(types);
          if (!keys.length) {
            console.warn('expandRootTypes::types are empty');
            return Promise.resolve(types);
          }
          var promises = keys.map(function (key) {
            return ExpansionLibrary._expandType(types, key);
          });
          return Promise.all(promises).then(function (results) {
            results.forEach(function (result) {
              types[result[0]] = result[1];
            });
            return types;
          }).then(function (result) {
            console.warn('expandRootTypes::types');
            console.log(result);
            return ConsistencyHelper.makeConsistent(result);
          });
        }
        /**
         * Expands a single type.
         *
         * @param {Object} types A map of RAML types
         * @param {String} key A key of currently processed type.
         * @return {Promise} Resolved to expanded canonical form of the type.
         */

      }, {
        key: "_expandType",
        value: function _expandType(types, key) {
          return new Promise(function (resolve) {
            // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
            var library = isNode ? require('datatype-expansion') : datatype_expansion.js;
            library.expandedForm(types[key], types, function (err, expanded) {
              if (err) {
                console.error(err);
              }
              if (expanded) {
                library.canonicalForm(expanded, function (err2, canonical) {
                  if (err2) {
                    console.error(err2);
                  }
                  if (canonical) {
                    resolve([key, canonical]);
                  } else {
                    console.log('No canonical form for ' + key);
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
      }]);

      return ExpansionLibrary;
    }();

    module.exports.ExpansionLibrary = ExpansionLibrary;
  }, { "./consistency-helpers": 5, "datatype-expansion": 9 }], 8: [function (require, module, exports) {
    'use strict';

    /**
     * Transforms security schemes of RAML object.
     */

    var SecuritySchemesTransformer = function () {
      function SecuritySchemesTransformer() {
        _classCallCheck(this, SecuritySchemesTransformer);
      }

      _createClass(SecuritySchemesTransformer, null, [{
        key: "isObject",

        // Checks if given `obj` is an Object.
        value: function isObject(obj) {
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

      }, {
        key: "addSecuritSchemes",
        value: function addSecuritSchemes(object, rootSchemes) {
          if (!rootSchemes || !Object.keys(rootSchemes).length) {
            return;
          }
          if (!object || !object.securedBy || !object.securedBy.length) {
            return;
          }
          var added = false;
          object.securedBy.forEach(function (item, i) {
            if (typeof item === 'string') {
              if (item in rootSchemes) {
                added = true;
                object.securedBy[i] = Object.assign({}, rootSchemes[item]);
              }
            } else if (SecuritySchemesTransformer.isObject(item)) {
              var keys = Object.keys(item);
              var key = keys[0];
              if (key in rootSchemes) {
                added = true;
                var schema = Object.assign({}, rootSchemes[key]);
                var params = item[key];
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

      }, {
        key: "transform",
        value: function transform(object) {
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
          object.securedBy.forEach(function (scheme) {
            if (!scheme || typeof scheme === 'string') {
              return;
            }
            if (scheme.describedBy) {
              if (scheme.describedBy.queryParameters) {
                object.queryParameters = object.queryParameters.concat(scheme.describedBy.queryParameters);
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
          responses.sort(function (a, b) {
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
      }]);

      return SecuritySchemesTransformer;
    }();

    module.exports.SecuritySchemesTransformer = SecuritySchemesTransformer;
  }, {}], 9: [function (require, module, exports) {}, {}] }, {}, [1]);


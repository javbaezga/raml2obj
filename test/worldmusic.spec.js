/* eslint-env node, mocha */

const raml2obj = require('..');
const {assert} = require('chai');
const parser = require('./parser');

describe('raml2obj', () => {
  describe('worldmusic.raml', function() {
    this.timeout(10000);

    let obj;
    const customSchemeCompare = [{
      name: 'custom_scheme',
      type: 'x-custom',
      description: 'A custom security scheme for authenticating requests.\n',
      describedBy: {
        headers: [{
            name: 'SpecialToken',
            displayName: 'SpecialToken',
            type: 'string',
            required: true,
            description: 'Used to send a custom token.\n',
            key: 'SpecialToken',
            typePropertyKind: 'TYPE_EXPRESSION'
          }],
        responses: [{
            code: '401',
            description: 'Bad token.\n'
          }, {
            code: '403'
          }]
      }
    }];

    before(() => {
      return parser('test/worldmusic.raml')
      .then(result => raml2obj.parse(result))
      .then((result) => {
        obj = result;
      });
    });

    it('should test the basic properties of the raml object', () => {
      assert.strictEqual(obj.title, 'World Music API');
      assert.strictEqual(obj.version, 'v1');
      assert.strictEqual(obj.baseUri, 'http://{environment}.musicapi.com/{version}');
      assert.strictEqual(obj.resources.length, 3); // /api, /entry, /songs
    });

    it('should test baseUriParameters', () => {
      assert.strictEqual(obj.baseUriParameters.length, 2);

      assert.strictEqual(obj.baseUriParameters[0].name, 'environment');
      assert.strictEqual(obj.baseUriParameters[0].type, 'string');
      assert.strictEqual(obj.baseUriParameters[0].required, true);
      assert.deepEqual(obj.baseUriParameters[0].enum, ['stg', 'dev', 'test', 'prod']);

      assert.strictEqual(obj.baseUriParameters[1].name, 'version');
      assert.strictEqual(obj.baseUriParameters[1].type, 'string');
      assert.strictEqual(obj.baseUriParameters[1].required, true);
      assert.deepEqual(obj.baseUriParameters[1].enum, ['v1']);
    });

    it('should test the documentation', () => {
      assert.strictEqual(obj.documentation.length, 2);

      const first = obj.documentation[0];
      const second = obj.documentation[1];

      assert.strictEqual(first.title, 'Getting Started');
      assert.strictEqual(first.content, 'This is a getting started guide for the World Music API.\n');

      assert.strictEqual(second.title, 'Legal');
      assert.strictEqual(second.content, 'See http://legal.musicapi.com');
    });

    it('should test the /api resource', () => {
      const resource = obj.resources[0];

      assert.strictEqual(resource.relativeUri, '/api');
      assert.strictEqual(resource.displayName, '/api');
      assert.strictEqual(resource.parentUrl, '');
      assert.deepEqual(resource.securedBy, customSchemeCompare);
      assert.strictEqual(resource.allUriParameters.length, 2);
    });

    it('should test the /api methods', () => {
      const methods = obj.resources[0].methods;

      assert.strictEqual(methods.length, 2);

      const get = methods[0];

      assert.strictEqual(get.method, 'get');
      assert.strictEqual(get.allUriParameters.length, 2);
      assert.deepEqual(get.securedBy, customSchemeCompare);

      assert.strictEqual(get.queryString.name, 'queryString');
      assert.strictEqual(get.queryString.type, 'object');
      // assert.strictEqual(get.queryString.required, true);
      assert.strictEqual(get.queryString.properties.length, 2);
      assert.strictEqual(get.queryString.properties[0].name, 'start');
      assert.strictEqual(get.queryString.properties[0].required, false);
      assert.strictEqual(get.queryString.properties[0].type, 'number');

      assert.strictEqual(get.queryString.properties[1].name, 'page-size');
      assert.strictEqual(get.queryString.properties[1].required, false);
      assert.strictEqual(get.queryString.properties[1].type, 'number');

      const post = methods[1];

      assert.strictEqual(post.method, 'post');
      assert.strictEqual(post.allUriParameters.length, 2);
      assert.deepEqual(post.securedBy, customSchemeCompare);
      assert.strictEqual(post.body.length, 1);
      assert.strictEqual(post.body[0].name, 'application/json');
      assert.strictEqual(post.body[0].key, 'application/json');
      assert.strictEqual(post.body[0].type, 'object');
      // assert.strictEqual(post.body[0].required, true);
      // assert.lengthOf(post.body[0].anyOf, 4);
      // assert.lengthOf(post.body[0].anyOf[0].properties, 14);
      // assert.lengthOf(post.body[0].anyOf[1].properties, 14);
      // assert.lengthOf(post.body[0].anyOf[2].properties, 14);
      // assert.lengthOf(post.body[0].anyOf[3].properties, 14);
    });

    it('should test the /entry resource', () => {
      const resource = obj.resources[1];

      assert.strictEqual(resource.relativeUri, '/entry');
      assert.strictEqual(resource.displayName, '/entry');
      assert.strictEqual(resource.parentUrl, '');
      assert.strictEqual(resource.type, 'collection');
      assert.deepEqual(resource.securedBy, customSchemeCompare);
      assert.strictEqual(resource.allUriParameters.length, 2);
    });

    it('should test the /entry methods', () => {
      const methods = obj.resources[1].methods;

      assert.strictEqual(methods.length, 2);

      const post = methods[0];

      assert.strictEqual(post.method, 'post');
      assert.strictEqual(post.allUriParameters.length, 2);
      assert.deepEqual(post.securedBy, customSchemeCompare);
      assert.strictEqual(post.responses.length, 3);
      assert.strictEqual(post.responses[0].code, '200');
      assert.strictEqual(post.responses[0].body.length, 1);
      assert.strictEqual(post.responses[0].body[0].name, 'application/json');
      assert.strictEqual(post.responses[0].body[0].key, 'application/json');
      assert.strictEqual(post.responses[0].body[0].type, 'json');
      assert.strictEqual(post.responses[0].body[0].content.indexOf('{\n  "type": "array"'), 0);

      const get = methods[1];

      assert.strictEqual(get.method, 'get');
      assert.strictEqual(get.description, 'returns a list of entry');
      assert.strictEqual(get.allUriParameters.length, 2);
      assert.deepEqual(get.securedBy, customSchemeCompare);
      assert.strictEqual(get.responses.length, 3);
      assert.strictEqual(get.responses[0].code, '200');
      assert.strictEqual(get.responses[0].body.length, 1);
      assert.strictEqual(get.responses[0].body[0].name, 'application/json');
      assert.deepEqual(get.responses[0].body[0].schema, ['Entry']);
    });

    it('should test the /songs resource', () => {
      const resource = obj.resources[2];

      assert.strictEqual(resource.relativeUri, '/songs');
      assert.strictEqual(resource.displayName, 'Songs');
      assert.strictEqual(resource.description, 'Access to all songs inside the music world library.');
      assert.strictEqual(resource.parentUrl, '');
      assert.deepEqual(resource.securedBy, customSchemeCompare);
      assert.strictEqual(resource.allUriParameters.length, 2);
      assert.strictEqual(resource.annotations.length, 1);
      assert.strictEqual(resource.annotations[0].name, 'ready');
      assert.deepEqual(resource.is, ['secured']);
      assert.strictEqual(resource.resources.length, 1);
    });

    it('should test the /songs methods', () => {
      const methods = obj.resources[2].methods;

      assert.strictEqual(methods.length, 2);

      const get = methods[0];

      assert.strictEqual(get.method, 'get');
      assert.strictEqual(get.allUriParameters.length, 2);
      assert.equal(typeof get.securedBy[0], 'object');
      assert.strictEqual(get.securedBy[1], null);

      assert.strictEqual(get.annotations.length, 1);
      assert.strictEqual(get.annotations[0].name, 'monitoringInterval');
      assert.strictEqual(get.annotations[0].structuredValue, 30);

      assert.strictEqual(get.queryParameters.length, 3);

      const post = methods[1];

      assert.strictEqual(post.method, 'post');
      assert.deepEqual(post.securedBy, customSchemeCompare);
      assert.strictEqual(post.queryParameters.length, 1);
    });

    it('should test the /songs/{songId} resource', () => {
      const resource = obj.resources[2].resources[0];

      assert.strictEqual(resource.relativeUri, '/{songId}');
      assert.strictEqual(resource.displayName, '/{songId}');
      assert.strictEqual(resource.parentUrl, '/songs');
      assert.deepEqual(resource.securedBy, customSchemeCompare);
      assert.strictEqual(resource.allUriParameters.length, 3);
    });

    it('should test the /songs/{songId} methods', () => {
      const methods = obj.resources[2].resources[0].methods;

      assert.strictEqual(methods.length, 1);

      const get = methods[0];

      assert.strictEqual(get.method, 'get');
      assert.strictEqual(get.allUriParameters.length, 3);
      assert.strictEqual(get.annotations.length, 1);
      assert.strictEqual(get.responses.length, 3);
      assert.deepEqual(get.securedBy, customSchemeCompare);

      assert.strictEqual(get.responses[0].body.length, 2);
      assert.strictEqual(get.responses[0].body[0].displayName, 'Song');
      assert.strictEqual(get.responses[0].body[0].key, 'application/json');
      assert.strictEqual(get.responses[0].body[0].examples.length, 2);
      assert.strictEqual(get.responses[0].body[0].type, 'object');

      assert.strictEqual(get.responses[0].body[1].type.indexOf('<?xml version="1.0" encoding="UTF-8"?>'), 0);
    });
  });
});

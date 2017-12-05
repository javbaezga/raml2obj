/* eslint-env node, mocha */

const raml2obj = require('..');
const assert = require('assert');
const parser = require('./parser');

describe('raml2obj', () => {
  describe('paths.raml', () => {
    let obj;

    before(() => {
      return parser('test/paths.raml')
      .then(result => raml2obj.parse({
        json: result
      }))
      .then((result) => {
        obj = result.json;
      });
    });

    it('Computes mathod access URIs', () => {
      var method = obj.resources[0].methods[0];
      assert.equal(method.absoluteUri, 'https://domain.com/api/resource');
      assert.equal(method.relativeUri, '/resource');
      assert.equal(method.baseUri, 'https://domain.com/api/');
    });

    it('Computes mathod access URIs recursevily', () => {
      var method = obj.resources[0].resources[0].methods[0];
      assert.equal(method.absoluteUri, 'https://domain.com/api/resource/${sub}');
      assert.equal(method.relativeUri, '/resource/${sub}');
      assert.equal(method.baseUri, 'https://domain.com/api/');
    });
  });

  describe('paths-relative.raml', () => {
    let obj;

    before(() => {
      return parser('test/paths-relative.raml')
      .then(result => raml2obj.parse({
        json: result
      }))
      .then((result) => {
        obj = result.json;
      });
    });

    it('Computes mathod access URIs', () => {
      var method = obj.resources[0].methods[0];
      assert.equal(method.absoluteUri, '/api/resource');
      assert.equal(method.relativeUri, '/resource');
      assert.equal(method.baseUri, '/api/');
    });

    it('Computes mathod access URIs recursevily', () => {
      var method = obj.resources[0].resources[0].methods[0];
      assert.equal(method.absoluteUri, '/api/resource/${sub}');
      assert.equal(method.relativeUri, '/resource/${sub}');
      assert.equal(method.baseUri, '/api/');
    });
  });
});

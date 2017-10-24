/* eslint-env node, mocha */

const raml2obj = require('..');
const assert = require('assert');
const parser = require('./parser');

describe('raml2obj', () => {
  describe('typeexample.raml', () => {
    let obj;

    before(() => {
      return parser('test/typeexample.raml')
      .then(result => raml2obj.parse(result))
      .then((result) => {
        obj = result;
      });
    });

    it('should test the array items', () => {
      const uriParameter = obj.resources[0].uriParameters[0];
      assert.strictEqual(uriParameter.description, 'A valid MongoDB object id.');
      assert.strictEqual(uriParameter.examples[0], '576bca8b70fddb149c4a9e92');
    });
  });
});

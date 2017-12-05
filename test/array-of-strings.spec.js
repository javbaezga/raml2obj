/* eslint-env node, mocha */

const raml2obj = require('..');
const assert = require('assert');
const parser = require('./parser');

describe('raml2obj', () => {
  describe('array-of-strings.raml', () => {
    let obj;

    before(() => {
      return parser('test/array-of-strings.raml')
      .then(result => raml2obj.parse({
        json: result
      }))
      .then((result) => {
        obj = result.json;
      });
    });

    it('should test the array items', () => {
      const body = obj.resources[0].methods[0].responses[0].body[0];
      assert.strictEqual(body.type, 'array');
      assert.strictEqual(body.items, 'string');
    });
  });
});

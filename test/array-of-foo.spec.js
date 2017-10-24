/* eslint-env node, mocha */

const raml2obj = require('..');
const assert = require('assert');
const parser = require('./parser');

describe('raml2obj', () => {
  describe('array-of-foo.raml', () => {
    let obj;

    before(() => {
      return parser('test/array-of-foo.raml')
      .then(result => raml2obj.parse(result))
      .then((result) => {
        obj = result;
      });
    });

    it('should test the array items', () => {
      const body = obj.resources[0].methods[0].responses[0].body[0];
      assert.strictEqual(body.type, 'array');
      assert.strictEqual(body.items.displayName, 'Foo');
      assert.strictEqual(body.items.required, true);
    });
  });
});

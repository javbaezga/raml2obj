/* eslint-env node, mocha */

const raml2obj = require('..');
const assert = require('assert');
const parser = require('./parser');

describe('raml2obj', () => {
  describe('inheritance.raml', () => {
    let obj;
    let properties;
    before(() => {
      return parser('inheritance.raml')
      .then(result => raml2obj.parse(result))
      .then((result) => {
        obj = result;
        properties = obj.resources[0].methods[0].body[0].properties;
      });
    });

    it('should test the basic properties of the raml object', () => {
      assert.strictEqual(obj.title, 'Inheritance Test');
      assert.strictEqual(obj.resources.length, 1);
    });

    it('should contain inheritated and inline defined properties', () => {
      assert.strictEqual(properties.length, 5);
    });

    it('should test type inheritance', () => {

      assert.strictEqual(properties[0].displayName, 'name');
      assert.strictEqual(properties[0].type, 'string');

      assert.strictEqual(properties[1].displayName, 'email');
      assert.strictEqual(properties[1].type, 'string');
      assert.strictEqual(properties[1].pattern, '^.+@.+\\..+$');

      assert.strictEqual(properties[2].displayName, 'gender');
      assert.strictEqual(properties[2].type, 'string');
      assert.strictEqual(properties[2].enum.length, 2);

      assert.strictEqual(properties[3].displayName, 'password');
      assert.strictEqual(properties[3].type, 'string');
    });
  });
});

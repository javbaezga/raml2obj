/* eslint-env node, mocha */
const raml2obj = require('..');
const {assert} = require('chai');
const parser = require('./parser');

describe('raml2obj', () => {
  describe('inheritance.raml', () => {
    let obj;
    let properties;
    before(() => {
      return parser('test/inheritance.raml')
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

    it('Inline declared properties are firest in array', () => {
      assert.strictEqual(properties[0].displayName, 'additional');
      assert.strictEqual(properties[0].type, 'string');
    });

    it('should inherit rest of properties', () => {
      assert.strictEqual(properties[1].displayName, 'name');
      assert.strictEqual(properties[1].type, 'string');

      assert.strictEqual(properties[2].displayName, 'email');
      assert.strictEqual(properties[2].type, 'string');
      assert.strictEqual(properties[2].pattern, '^.+@.+\\..+$');

      assert.strictEqual(properties[3].displayName, 'gender');
      assert.strictEqual(properties[3].type, 'string');
      assert.strictEqual(properties[3].enum.length, 2);

      assert.strictEqual(properties[4].displayName, 'password');
      assert.strictEqual(properties[4].type, 'string');
    });

    it('should expand a type', () => {
      let props = obj.types.PasswordProtectedAccount.properties;
      assert.lengthOf(props, 4);
    });

    it('should expand type properties', () => {
      assert.equal(obj.types.Account.properties[1].name, 'email');
    });
  });
});

/* eslint-env node, mocha */

const raml2obj = require('..');
const assert = require('assert');
const parser = require('./parser');

describe('raml2obj', () => {
  describe('indexof.raml', () => {
    let obj;

    before(() => {
      return parser('test/indexof.raml')
      .then(result => raml2obj.parse({
        json: result
      }))
      .then((result) => {
        obj = result.json;
      });
    });

    it('should test the basic properties of the raml object', () => {
      assert.strictEqual(obj.title, 'Test');
      assert.strictEqual(obj.resources.length, 1);
    });

    it('should test the GET /test method', () => {
      const GET = obj.resources[0].methods[0];
      const body = GET.body[0];
      assert.strictEqual(body.type.displayName, 'type');
      assert.strictEqual(body.type.properties[0].name, 'o1a');
    });
  });
});
